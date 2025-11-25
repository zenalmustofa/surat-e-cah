// config/multerConfig.js
const multer = require('multer');
const path = require('path');

// Set Storage Engine
const storage = multer.diskStorage({
    destination: './uploads/', // Pastikan folder ini ada di root
    filename: function(req, file, cb) {
        // Format nama file: FIELDNAME-TIMESTAMP.EXT
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // Batas 5MB
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
});

// Fungsi Cek Tipe File (Hanya Gambar & PDF)
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Hanya boleh upload Gambar (Images) atau PDF!');
    }
}

module.exports = upload;