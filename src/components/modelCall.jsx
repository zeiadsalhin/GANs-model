import { useEffect, useState } from 'react';

export default function ClientComponent() {
    const [data, setData] = useState(null);
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/callGradio');
                const result = await response.json();
                
                if (response.ok) {
                    setStatus(result.status);
                    setData(result.data); // Set the response data
                    console.log(result);
                } else {
                    setStatus(result.status);
                    setError(result.message);
                    console.log(response);
                }
            } catch (error) {
                console.log(error);
                setError('Error fetching data');
            }
        }

        fetchData();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Gradio API Call</h1>
            {status && <p>Status: {status}</p>}
            {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}
        </div>
    );
}