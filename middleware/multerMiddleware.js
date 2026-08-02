const multer = require('multer');
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}


//Configure Multer disk storage for uploading images
const storage = multer.diskStorage({
     destination: function (req, file, cb) {
        return cb(null, uploadDir) //null is custom error added by developer
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); //Use a timestamp to avoid file name conflicts
    }

})


//Configure Multer to accept only image files (JPEG, JPG, PNG)
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            // Accept the file
            cb(null, true); 
        } else {
            // Reject the file
            cb(new Error('Invalid file type'), false); //doesn't accept the file
        }
    }
});

//Export Multer middleware to handle single image file with the field name "medicineImage"
module.exports = upload.single("medicineImage")