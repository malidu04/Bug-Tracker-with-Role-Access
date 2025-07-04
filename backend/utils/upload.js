const path = require('path');
const multer = require('multer');
const ErrorResponse = require('./ErrorResponse');

// Set storage engine
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, process.env.FILE_UPLOAD_PATH);
  },
  filename: function(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  }
});

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: process.env.MAX_FILE_UPLOAD },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('file');

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new ErrorResponse('Error: File upload only supports the following filetypes - ' + filetypes, 400));
  }
}

module.exports = upload;