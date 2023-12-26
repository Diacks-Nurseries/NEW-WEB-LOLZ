const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const app = express();
const port = 3000;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads'); // Upload files to the 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'backend.html')); // Update the file name here
});


app.post('/upload', upload.single('pdfFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const filename = req.file.originalname;
    const viewLink = `http://localhost:3000/uploads/${filename}`; // Update with your actual server URL

    // Get the shareable link to the Google Sheets document
    const iframeLink = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRAZULWApO-x_oeRlp0wPStDpy7KJ4qUeDJYHdLFGhSptCVKMLO_3vaV3t6kMPweZx9q1fxQk81owBn/pubhtml';

    res.json({
        originalname: filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        viewLink: viewLink,
        iframeLink: iframeLink,
    });
});

app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
