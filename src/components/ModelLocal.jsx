import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // import icons
import { faCloudUploadAlt, faSpinner, faDownload } from '@fortawesome/free-solid-svg-icons'; // import icons
import { LinearProgress } from '@mui/material';

const ModelCall = () => {
  const [imageServer, setImageServer] = useState(null); // Holds the uploaded image
  const [previewServer, setPreviewServer] = useState(""); // Holds the image preview URL
  const [returnedImageServer, setReturnedImageServer] = useState(""); // Holds the returned generated image
  const [loaderServer, setLoaderServer] = useState(false)
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null)
  

  // Handle file input change (when user selects a file)
  const handleFileChange = (event) => {
    setProgress(0) // make sure to start again 
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader(); // Use FileReader to preview the image
      reader.onloadend = () => {
        setPreviewServer(reader.result); // Set the image preview
        setImageServer(file); // Set the image for upload
      };
      reader.readAsDataURL(file); // Read image as data URL for preview
    }
    event.target.value = null; // Reset the file input field to allow re-uploading the same file
  };

// handle drag and drop area 
const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewServer(reader.result);
            setImageServer(file); // set image
        }
        reader.readAsDataURL(file); // Read image as data URL for preview
    }
};

const handleDragOver = (e) => {
    e.preventDefault(); // Prevent double function trigger
};


// Function to send the image to FastAPI server and receive the generated image
const fetchData = async () => {
  if (!imageServer) { // must have image to send to model
    return;
  }

  setLoaderServer(true);
  setError(null);
  const img_file = new FormData(); // Create FormData for the file upload 
  img_file.append("image", imageServer); // Append the file to FormData

  try {
    // Send the image file to the FastAPI server
    const response = await axios.post("https://bonefish-accepted-separately.ngrok-free.app/upsample", img_file, {
      headers: {
        "Content-Type": "multipart/form-data", // This header is important for file uploads
      },
      responseType: "arraybuffer", // Expect binary data (image)
    });

    // Create a Blob from the response data (the image)
    const blob = new Blob([response.data], { type: "image/png" });
    // progress 50%
    setProgress(50)

    // Upload the generated image to imgBB cdn for public access
    const imgBBAPIKey = "dc02c6e93442dadcbb2a9cbdf68820db";
    const imgBBFormData = new FormData();
    imgBBFormData.append("image", blob);

    // Send the image to imgBB 
    const uploadResponse = await axios.post(`https://api.imgbb.com/1/upload?key=${imgBBAPIKey}`, imgBBFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    });

    // progress 100%
    setProgress(100)
    
    // Get the URL from imgBB's response
    const imageUrl = uploadResponse.data.data.url; // This is the direct URL to the Generated image

    setTimeout(() => { // for dynamic view the image after progress is completed
    // Set the generated image URL to display the image
    setReturnedImageServer(imageUrl);
    setLoaderServer(false);
    }, 500);

  } catch (error) {
    console.error("Error uploading image:", error);
    setLoaderServer(false);
    setError(error);
  }
};

  return (
    <div className='main flex flex-col mx-auto justify-center text-center w-screen mt-24 mb-10'>
                <h1 className='text-3xl font-bold'>GANs Super Resolution</h1>
                <p className='p-3 opacity-70 text-sm'>Upload your low resolution image to get high quality.</p>
    
        <div className='flex flex-col p-5'>
    
            {!returnedImageServer && 
            <div className="input mx-auto flex flex-col justify-center p-5 min-h-[24rem]">
    
            {/*drag or upload image*/}
            {!loaderServer && 
            <div
                className="upload-area"
                onClick={()=>{document.getElementById('file-uploadServer').click()}}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                style={{
                border: '2px dashed #ccc',
                borderRadius: '1rem',
                padding: '4rem',
                textAlign: 'center',
                cursor: 'pointer'
                }}
            >
            <label className="custom-file-upload cursor-pointer">
                <FontAwesomeIcon icon={faCloudUploadAlt} size='2xl' /> {previewServer ? 'Change' : 'Upload'} Image
            </label>
            <input id="file-uploadServer" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
            </div>
            }
               
            {previewServer && 
            <div className="">
            <img src={previewServer}  className='mx-auto m-5' alt="Preview" width={200} />

            {loaderServer &&
            <div className="progressbar m-4">
            <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{
            height: 12,
            margin: 1,
            borderRadius: 1,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
            backgroundColor: '#9e9e9e', // color for progress bar
            },}} />
            <p className="font-bold">{`${progress}%`}</p>
            </div>
            }
            <button onClick={()=>{previewServer? fetchData() : undefined}}>
            {loaderServer ? <FontAwesomeIcon icon={faSpinner} size='xl' spin /> : 'Upload to Model'}
            </button>
            </div>}
            </div>
            }

          {returnedImageServer &&
          <>
          <div className="result p-5">
          <h2 className='text-2xl p-3 font-bold'>Result</h2>
           <img src={returnedImageServer} className='mx-auto m-5 min-h-[10rem]' alt="Returned" width={400} />
          </div>

          <p className="text-sm opacity-70">*All Images are Saved in generated_GANs folder</p>
    
          {/* Save Image Button */}
          <div className="save p-5">
          <a href={returnedImageServer} target="_blank" download={returnedImageServer}>
               <button>
                  <FontAwesomeIcon icon={faDownload} size='lg' /> View Image
                </button>
            </a>
          </div>
    
          <div className="reset p-5">
          <button onClick={()=>{setImageServer(null); setPreviewServer(null); setReturnedImageServer(null); setError(null)}}>Reset</button>
          </div>
          </>
        }

          {error && 
          <div className="error">
            <p className="text-red-800 text-sm font-semibold">{error.message} {error.code}</p>
          </div>
          }
        </div>
        </div>
  );
};

export default ModelCall;
