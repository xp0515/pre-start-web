const mongoose = require("mongoose");

const imgSchema = new mongoose.Schema({
    img: Buffer,
});

module.exports = mongoose.model('Img', imgSchema);