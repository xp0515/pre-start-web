const bodyParser = require('body-parser');
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
        console.log('Connected to Mongodb');
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

module.exports.upload = upload;