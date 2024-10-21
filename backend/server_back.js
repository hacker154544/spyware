const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

// Allow cross-origin requests (CORS)
app.use(cors());

// Serve static files from the "frontend" folder
app.use(express.static(path.join(__dirname, '../frontend')));

// Increase the payload size limit for JSON and URL-encoded bodies
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Route to handle image upload (POST request)
app.post('/upload-image', (req, res) => {
    const { image } = req.body;

    if (!image) {
        console.error('No image data received');
        return res.status(400).json({ error: 'No image data received' });
    }

    // Log the first part of the image data to verify it was received correctly
    console.log('Received image data:', image.slice(0, 100));

    // Decode base64 image
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    // Generate a unique filename using the current timestamp
    const timestamp = Date.now();
    const fileName = `user-image-${timestamp}.png`;

    // Path where the image will be saved (You can change this path to another location for testing)
    const imageDir = path.join('C:/Users/amohi/OneDrive/Documents/stock');

    // Check if the directory exists; if not, create it
    if (!fs.existsSync(imageDir)) {
        console.log('Directory does not exist, creating it...');
        fs.mkdirSync(imageDir, { recursive: true });
    }

    const imagePath = path.join(imageDir, fileName);

    // Save the image
    fs.writeFile(imagePath, base64Data, 'base64', (err) => {
        if (err) {
            console.error('Error saving image:', err);
            return res.status(500).json({ error: 'Failed to save image' });
        }

        console.log('Image saved successfully at:', imagePath);
        res.json({ message: `Image uploaded and saved successfully as ${fileName}` });
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
