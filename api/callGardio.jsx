import { Client } from "@gradio/client";

export default async function handler(req, res) {
    try {
        const client = await Client.connect("https://alfa11-grad.hf.space");
        const result = await client.predict("/predict", {
            // Provide the necessary inputs here based on the model's requirements
            data: []
        });
        res.status(200).json({ status: 'success', data: result.data }); // Send the status and HTML content
    } catch (error) {
        console.error("Error calling Gradio API:", error);
        res.status(500).json({ status: 'error', message: 'Error calling Gradio API' });
    }
}