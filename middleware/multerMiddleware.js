const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ensure the 'uploads' directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Created multer instance with disk storage to upload files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // null is custom error added by developer
        return cb(null, uploadsDir) 
    },
    filename: function (req, file, cb) {
        // Use a timestamp to avoid name conflicts
        cb(null, `${Date.now()}-${file.originalname}`); 
    }

})


// Configure Multer to accept only PDF files
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            // Accept the file
            cb(null, true); 
        } else {
            // Reject the file
            cb(new Error('Invalid file type'), false); 
        }
    }
});

// Export the Multer instance
module.exports = upload.single("medicineImage")