import { useState } from 'react';
import { Client } from "@gradio/client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function ClientComponent() {
    // define states
    const [image, setImage] = useState(null);
    const [returnedImage, setReturnedImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState(null);
    const [loader, setLoader] = useState(false)

    const fetchData = async () => {
        if(image) {
        setLoader(true);
        async function fetchData() {
            Client.connect("https://alfa11-gans.hf.space") //  connect to the image model
        .then(client => {
            return client.predict("/predict", 
                [image] // pass image blob
            );
        })
        .then(result => {
            // console.log(result.data[0].url);
            setReturnedImage(result.data[0].url)
            setLoader(false);
        })
        .catch(error => {
            console.error("Error calling Gradio API:", error);
            setError(error)
            setLoader(false);
        });
        }

        fetchData(); // call the function
    }
    };

    // handle image upload
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                setImage(file); // Set the image as a Blob
            };
            reader.readAsDataURL(file);
        }
        event.target.value = null; // allow the same image to upload
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
    <div className='main flex flex-col mx-auto justify-center text-center w-screen'>
            <h1>GANs Super Resolution</h1>

    <div className='flex flex-col p-5'>

        <div className="input mx-auto flex flex-col justify-center p-5">
       
        <label htmlFor="file-upload" className="custom-file-upload">
            <FontAwesomeIcon icon={faCloudUploadAlt} size='2xl' /> Upload Image
        </label>
        <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
        
        {preview && 
        <div className="">
        <img src={preview}  className='mx-auto m-5' alt="Preview" width={400} />
        <button onClick={()=>{preview? fetchData() : undefined}}>
        {loader ? <FontAwesomeIcon icon={faSpinner} size='xl' spin /> : 'Upload to Model'}
        </button>
        </div>}
        </div>

      {returnedImage &&
      <div className="result p-5">
      <h2 className='text-2xl p-3'>Result</h2>
       <img src={returnedImage} className='mx-auto m-5' alt="Returned" width={400} />
      </div>}

      <div className="reset p-5">
      <button onClick={()=>{setImage(null); setPreview(null); setReturnedImage(null);}}>Reset</button>
      </div>

    </div>
        </div>
    );
}