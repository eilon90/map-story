const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
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

userSchema.pre('save', function(next) {
    // Check if document is new or a new password has been set
    if (this.isNew || this.isModified('password')) {
      // Saving reference to this because of changing scopes
      const document = this;
      bcrypt.hash(document.password, saltRounds,
        function(err, hashedPassword) {
        if (err) {
          next(err);
        }
        else {
          document.password = hashedPassword;
          console.log(hashedPassword)
          next();
        }
      });
    } else {
      next();
    }
  });


userSchema.methods.isCorrectPassword = function(password, callback){
    console.log(`|${password}|`)
    console.log(`|${this.password}|`)
    let a = '1234';
    bcrypt.compare(password, this.password, function(err, same) {
        if (err) {
            callback(err);
        } else {
            console.log(same);
        callback(err, same);
      }
    })};

const User = mongoose.model('User', userSchema);
module.exports = User;