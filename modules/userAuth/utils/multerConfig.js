const multer = require('multer');
const path = require('path');
const AppError = require('../../../shared/utils/AppError')

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null ,'uploads/officers/')
    },
    filename: (req,file,cb)=>{
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'officer-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files are allowed', 400), false);
  }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = upload;