const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');  // For unique file names

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.post('/upload-image', (req, res) => {
    const { image, latitude, longitude } = req.body;

    if (!image || !latitude || !longitude) {
        console.error('Missing image or location data');
        return res.status(400).json({ error: 'Missing image or location data' });
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    // Generate a unique filename using UUID
    const uniqueFilename = `user-image-${uuidv4()}.png`;

    // Path where the image will be saved
    const imageDir = path.join('C:/Users/amohi/OneDrive/Documents/stock');

    // Check if the directory exists; if not, create it
    if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true });
    }

    const imagePath = path.join(imageDir, uniqueFilename);

    // Save the image to the file system
    fs.writeFile(imagePath, base64Data, 'base64', (err) => {
        if (err) {
            console.error('Error saving image:', err);
            return res.status(500).json({ error: 'Failed to save image' });
        }

        console.log(`Image saved successfully at: ${imagePath}`);
        console.log(`Location data: Latitude: ${latitude}, Longitude: ${longitude}`);
        
        // You can store the image path and location data in a database if needed

        res.json({ message: `Image uploaded and saved as ${uniqueFilename}`, latitude, longitude });
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
