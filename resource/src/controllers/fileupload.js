const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        console.log('multer middleware');
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = file.originalname;
        req.thefile = file;
        cb(null, name);
    }
});

const upload = multer({ storage });

module.exports = upload;