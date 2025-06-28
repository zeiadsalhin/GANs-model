import os
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
from PIL import Image
from pathlib import Path

# Initialize FastAPI app
app = FastAPI()

# Enable CORS (adjust allow_origins for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure the output directory exists
output_dir = "generated_GANs"
os.makedirs(output_dir, exist_ok=True)

@app.post("/generate/")
async def generate_image_from_file(file: UploadFile = File(...)):
    # Read image bytes from the upload
    image_bytes = await file.read()

    # Open image using PIL
    try:
        image = Image.open(BytesIO(image_bytes))
    except Exception as e:
        return {"error": "Invalid image file", "details": str(e)}

    # Clean filename to avoid path traversal
    filename = Path(file.filename).name
    file_path = os.path.join(output_dir, filename)

    # Save image to disk
    image.save(file_path)

    # Prepare image for response
    img_byte_arr = BytesIO()
    image.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)

    return StreamingResponse(img_byte_arr, media_type="image/png")

# Run server directly if script is called
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="127.0.0.1", port=8003, reload=True)
