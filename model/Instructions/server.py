import os
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
from PIL import Image

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware to allow requests from your React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (adjust as needed)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Make sure the directory exists
os.makedirs('generated_GANs', exist_ok=True)

@app.post("/generate/")
async def generate_image_from_file(file: UploadFile = File(...)):
    # Read the image file from the request
    image_bytes = await file.read()

    # Open the image using PIL
    image = Image.open(BytesIO(image_bytes))

    # Save the image to the generated_GANs folder
    file_path = os.path.join('generated_GANs', file.filename)
    image.save(file_path)

    # Convert the image back to bytes for response
    img_byte_arr = BytesIO()
    image.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)

    # Return the image as a response (StreamingResponse allows us to return binary data)
    return StreamingResponse(img_byte_arr, media_type="image/png")
