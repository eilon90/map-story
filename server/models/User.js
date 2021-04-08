const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:  { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userName: { type: String, required: true },
    firstName: String,
    lastName: String,
    profilePic: {
        imageUrl: String,
        imageId: String
    },
    stories: []
})

const User = mongoose.model('User', userSchema);
module.exports = User;