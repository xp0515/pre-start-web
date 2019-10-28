const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const routes = require('./routes/index.router');
const checkAuth = require('./middleware/check-auth');

const app = express();

const mongoURI = 'mongodb+srv://Peng:JCS6cs93gvVUY9VL@vehicleinspection-ff15g.mongodb.net/vehicleInspection?retryWrites=true&w=majority'
mongoose.connect(mongoURI,
  { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
  .then(() => {
    console.log('Connected to Mongodb');
  })
  .catch(() => {
    console.log('Connection failed');
  });
mongoose.set('useFindAndModify', false);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use("/", routes);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Orgin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use((req, res, next) => {
  next();
});

// const conn = mongoose.connection;
// let gfs;
// conn.once('open', () => {
//   gfs = Grid(conn.db, mongoose.mongo);
//   gfs.collection('uploads');
// });

// const storage = new GridFsStorage({
//   // url: 'mongodb+srv://Peng:JCS6cs93gvVUY9VL@vehicleinspection-ff15g.mongodb.net/vehicleInspection?retryWrites=true&w=majority',
//   db: conn,
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

// app.post('/files/upload', checkAuth.verifyJwtToken, upload.single('file'), (req, res, next) => {
//   res.json({ file: req.file });
// });

// app.get('/files', checkAuth.verifyJwtToken, (req, res, next) => {
//   gfs.files.find().toArray((err, files) => {
//     if (!files || files.length === 0) {
//       return res.status(404).json({
//         err: 'No files exist'
//       });
//     }
//     return res.json(files);
//   })
// })

// app.get('/file/:filename', (req, res, next) => {
//   gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//     if (err) {
//       res.status(404).json({ err: 'No file exists' });
//     }
//     if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
//       const readstream = gfs.createReadStream(file.filename);
//       readstream.pipe(res);
//     } else {
//       res.status(404).json({
//         err: 'Not an image'
//       });
//     }
//   })
// })

module.exports = app;

