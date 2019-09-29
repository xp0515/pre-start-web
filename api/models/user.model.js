const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: "Email can't be empty", unique: true },
  password: {
    type: String,
    required: "Password can't be empty",
    minlength: [4, "Password must be atleast 4 character long"]
  },
  name: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
