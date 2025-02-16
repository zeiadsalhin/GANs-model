import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // import icons
import { faCloudUploadAlt, faSpinner, faDownload } from '@fortawesome/free-solid-svg-icons'; // import icons

const ModelCall = () => {
  const [image, setImage] = useState(null); // Holds the uploaded image
  const [preview, setPreview] = useState(""); // Holds the image preview URL
  const [returnedImage, setReturnedImage] = useState(""); // Holds the returned generated image
  const [loader, setLoader] = useState(false)

  // Handle file input change (when user selects a file)
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader(); // Use FileReader to preview the image
      reader.onloadend = () => {
        setPreview(reader.result); // Set the image preview
        setImage(file); // Set the image for upload
      };
      reader.readAsDataURL(file); // Read file as data URL for preview
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
            setPreview(reader.result);
            setImage(file); // set image
        }
        reader.readAsDataURL(file);
    }
};

const handleDragOver = (e) => {
    e.preventDefault();
};

  // Function to send the image to FastAPI server and receive the generated image
  const fetchData = async () => {
    if (!image) {
      return;
    }
    setLoader(true);
    const formData = new FormData(); // Create FormData for the file upload
    formData.append("file", image); // Append the file to FormData

    try {
      // Send the image file to the FastAPI server
      const response = await axios.post("https://bonefish-accepted-separately.ngrok-free.app/generate/", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // This header is important for file uploads
        },
        responseType: "arraybuffer", // Expect binary data (image)
      });

      // Create a Blob from the response data (the image)
      const blob = new Blob([response.data], { type: "image/png" });
      const imageUrl = URL.createObjectURL(blob); // Create a URL for the image

      // Set the generated image URL to display the image
      setReturnedImage(imageUrl);
      setLoader(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      setLoader(false);
    }
  };

  return (
    <div className='main flex flex-col mx-auto justify-center text-center w-screen mt-10 mb-20'>
                <h1 className='text-3xl font-bold'>GANs Super Resolution (Local)</h1>
                <p className='p-3 opacity-70 text-sm'>Upload your low resolution image to get high quality.</p>
    
        <div className='flex flex-col p-5'>
    
            {!returnedImage && 
            <div className="input mx-auto flex flex-col justify-center p-5">
    
            {/*drag or upload image*/}
            <div
                className="upload-area"
                onClick={()=>{document.getElementById('file-upload').click()}}
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
                <FontAwesomeIcon icon={faCloudUploadAlt} size='2xl' /> {preview ? 'Change' : 'Upload'} Image
            </label>
            <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
            </div>
    
               
            {preview && 
            <div className="">
            <img src={preview}  className='mx-auto m-5' alt="Preview" width={200} />
            <button onClick={()=>{preview? fetchData() : undefined}}>
            {loader ? <FontAwesomeIcon icon={faSpinner} size='xl' spin /> : 'Upload to Model'}
            </button>
            </div>}
            </div>
            }
    
          {returnedImage &&
          <>
          <div className="result p-5">
          <h2 className='text-2xl p-3 font-bold'>Result</h2>
           <img src={returnedImage} className='mx-auto m-5' alt="Returned" width={400} />
          </div>
    
          {/* Save Image Button */}
          <div className="save p-5">
                            <a href={returnedImage} target='_blank' download={returnedImage}>
                                <button>
                                    <FontAwesomeIcon icon={faDownload} size='lg' /> Download Image
                                </button>
                            </a>
                        </div>
    
          <div className="reset p-5">
          <button onClick={()=>{setImage(null); setPreview(null); setReturnedImage(null);}}>Reset</button>
          </div>
          </>
        }
    
        </div>
        </div>
  );
};

export default ModelCall;
