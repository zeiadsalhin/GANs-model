import { useState } from 'react'; // import app libraries
import { Client } from "@gradio/client"; // import the model connector
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // import icons
import { faCloudUploadAlt, faSpinner, faEye } from '@fortawesome/free-solid-svg-icons'; // import icons
import ModelLocal from './ModelLocal';

export default function ClientComponent() {
    // define app states
    const [image, setImage] = useState(null);
    const [returnedImage, setReturnedImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState(null);
    const [loader, setLoader] = useState(false)

    // establish connection and send the image to SR model
    const fetchDataServer = async () => { 
        if(image) {
        setLoader(true);
        async function fetchData() {
            Client.connect("https://alfa11-gans.hf.space") //  connect to the image model
        .then(client => {
            return client.predict("/predict", 
                [image] // pass image to the model
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

        fetchDataServer(); // call the function
    }
    };

    // handle image upload
    const handleFileChangeServer = (event) => {
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

    // handle drag and drop area 
    const handleDropServer = (e) => {
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

    const handleDragOverServer = (e) => {
        e.preventDefault();
    };

    // handle result error
    if (error) {
        return <div>Error: {error.message}</div>;
    }

    // display application interface
    return (
        <>
    <ModelLocal />
    <div className='main flex flex-col mx-auto justify-center text-center w-screen mt-10 mb-20'>
            <h1 className='text-3xl font-bold'>GANs Super Resolution (Server)</h1>
            <p className='p-3 opacity-70 text-sm'>Upload your low resolution image to get high quality.</p>

    <div className='flex flex-col p-5'>

        {!returnedImage && 
        <div className="input mx-auto flex flex-col justify-center p-5">

        {/*drag or upload image*/}
        <div
            className="upload-area"
            onClick={()=>{document.getElementById('file-upload').click()}}
            onDrop={handleDropServer}
            onDragOver={handleDragOverServer}
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
        <input id="file-upload" type="file" accept="image/*" onChange={handleFileChangeServer} style={{ display: 'none' }} />
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
                                <FontAwesomeIcon icon={faEye} size='lg' /> View Image
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
    </>
    );
}
