const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

const mongoURI = 'mongodb+srv://Peng:JCS6cs93gvVUY9VL@vehicleinspection-ff15g.mongodb.net/vehicleInspection?retryWrites=true&w=majority'
mongoose.connect(mongoURI,
    { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
    .then(() => {

    })
    .catch(() => {
        console.log('Connection failed');
    });
mongoose.set('useFindAndModify', false);

// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));

const conn = mongoose.connection;
let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

const storage = new GridFsStorage({
    // url: 'mongodb+srv://Peng:JCS6cs93gvVUY9VL@vehicleinspection-ff15g.mongodb.net/vehicleInspection?retryWrites=true&w=majority',
    db: conn,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage: storage });

module.exports.postFile = [upload.single('file'), (req, res, next) => {
    const file = req.file;
    console.log(req.file);
    if (!file) {
        return res.status(400).send('No file selected!');
    }
    return res.status(200).json({ file: req.file });
}]


//Uploading multiple files
// app.post('/uploadmultiple', upload.array('myFiles', 12), (req, res, next) => {
//   const files = req.files
//   if (!files) {
//     const error = new Error('Please choose files')
//     error.httpStatusCode = 400
//     return next(error)
//   }

//     res.send(files)

// })

module.exports.getFiles = (req, res, next) => {
    gfs.files.find().toArray((err, files) => {
        if (!files || files.length === 0) {
            return res.status(404).json({
                err: 'No files exist'
            });
        }
        return res.json(files);
    })
}

module.exports.getFile = (req, res, next) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        if (err) {
            res.status(404).json({ err: 'No file exists' });
        }
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        } else {
            res.status(404).json({
                err: 'Not an image'
            });
        }
    })
}