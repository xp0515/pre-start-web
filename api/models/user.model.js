const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  email: { type: String, required: "Email can't be empty", unique: true },
  password: {
    type: String,
    required: "Password can't be empty",
    minlength: [4, "Password must be atleast 4 character long"]
  },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
