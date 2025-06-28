from fastapi import FastAPI
from flask import Flask, redirect, request, jsonify, send_file, after_this_request, url_for
from srgan_model import load_model, upsample_image
from PIL import Image
import tempfile
import os
from fastapi.middleware.cors import CORSMiddleware
from flask_cors import CORS

# apps = FastAPI()

app = Flask(__name__)

CORS(app)  # Allow CORS for all requests

#Add CORS middleware to allow requests from your React frontend
# apps.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Allow all origins (adjust as needed)
#     allow_credentials=True,
#     allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
#     allow_headers=["*"],  # Allow all headers
# ) 

### the flask app ###
# the link is https://rnukh-197-52-37-216.a.free.pinggy.link/


model = load_model()  # Load the SRGAN model once at startup

@app.route('/')
def home():
    return redirect(url_for('upsample'))

@app.route('/upsample', methods=['POST'])
def upsample():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    img_file = request.files['image']
    
    # Log received file
    print(f"Received file: {img_file.filename}")
    
    # Save the input image to a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as temp_in:
        img_file.save(temp_in.name)
        print(f"Image saved to: {temp_in.name}")
        
        # Open the image using PIL
        image = Image.open(temp_in.name)
        
        # Resize the image to (64, 64) before processing (this matches the model's expected input)
        image = image.resize((64, 64))
        
        # Save the resized image to the same temporary file path
        image.save(temp_in.name)

        try:
            # Pass the resized image to the upsampling function
            output_path = upsample_image(temp_in.name, model)  # Your function returns a path to the upscaled image
            print(f"Upsampled image saved to: {output_path}")
        except Exception as e:
            print(f"Error during upsampling: {e}")
            return jsonify({'error': 'Upsampling failed', 'message': str(e)}), 500
    
    @after_this_request
    def remove_files(response):
        # Clean up temporary files after the response has been sent
        try:
            os.remove(temp_in.name)
            os.remove(output_path)
            print(f"Deleted temporary files: {temp_in.name}, {output_path}")
        except Exception as e:
            print(f"Error deleting files: {e}")
        return response

    # Send the upsampled image as a response
    try:
        return send_file(output_path, mimetype='image/png')
    except Exception as e:
        print(f"Error sending file: {e}")
        return jsonify({'error': 'Failed to send upsampled image', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
