const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  name: String,
  phone: Number,
  password: String,
},{timestamps:true});
module.exports = mongoose.model("user", userSchema);
