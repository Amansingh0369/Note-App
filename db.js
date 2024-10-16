const mongoose = require("mongoose");
require('dotenv').config();
const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl)

const noteSchema = new mongoose.Schema({
    title:String,
    body:String
});
const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,

})

const note = mongoose.model('Note', noteSchema);
const user = mongoose.model("Users",userSchema);

module.exports = {
    note,
    user
};
