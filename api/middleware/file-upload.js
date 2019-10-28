// const express = require('express');
// const bodyParser = require('body-parser');

// const multer = require('multer');
// const path = require('path');
// const crypto = require('crypto');
// const GridFsStorage = require('multer-gridfs-storage');
// const Grid = require('gridfs-stream');

// const storage = new GridFsStorage({
//   url: 'mongodb+srv://Peng:JCS6cs93gvVUY9VL@vehicleinspection-ff15g.mongodb.net/vehicleInspection?retryWrites=true&w=majority',
//   //db: mongoose.connection,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err);
//         }
//         const filename = buf.toString('hex') + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           bucketName: 'uploads'
//         };
//         resolve(fileInfo);
//       });
//     });
//   }
// });
// const upload = multer({ storage: storage });

// module.exports.uploadFile = upload.single('file');

// // app.post('/upload', upload.single('file'), (req, res, next) => {
// //   res.json({ file: req.file });
// // })
