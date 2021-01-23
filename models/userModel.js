const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    maxlength: [40, 'Your name must have less than 40 characters'],
    minlength: [10, 'Your name must have more than 10 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide us your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please fill a valid email address'],
    //could also use match(regex, msg) to validate email
  },
  photo: {
    type: String, //path to the photo
  },
  password: {
    type: String,
    required: [true, 'Required password'],
    minlength: [8, 'Your password must have more than 8 chars'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      //IT ONLY WORKS ON Create and SAVE, so we'll need to update by saving
      //and not find and update
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
});

userSchema.pre('save', async function (next) {
  //the this keyword refers to the current doc, (user)
  if (!this.isModified('password')) return next(); //only runs if password was modified
  //it hashes the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12); //12 refers to how CPU intensive
  //deletes the password confirm field
  this.passwordConfirm = undefined; //deletes password confirm
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
