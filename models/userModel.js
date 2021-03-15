const mongoose = require("mongoose");

const validator = require("validator");
const bycrpt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please tell us your name"],
  },
  email: {
    type: String,
    unique: true,

    required: [true, "please enter your email"],
    lowerCase: true,
    validate: [validator.isEmail, "Please enter valid email"],
  },
  photo: {
    type: String,
    // defult: "defultUser.png"
  },

  password: {
    type: String,
    required: [true, "please enter password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "please enter password"],
    validate: {
      //on create or save
      validator: function (el) {
        return el === this.password;
      },
      message: "password are not the same..",
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre("save", async function (next) {
  //only run if password modified
  if (!this.isModified("password")) return next();
  //hashing bycript with cost of 12
  this.password = await bycrpt.hash(this.password, 12); //defult 10
  this.passwordConfirm = undefined;
  next();
});

//instance method
//return true if password is the same
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bycrpt.compare(candidatePassword, userPassword);
};
//get data and saving in DB
// userSchema.methods.changedPasswordAfter = function () {
//   if (this.passwordChangedAt) {
//     console.log(this.passwordChangedAt, JWTTimestamps);
//   }
//   return false;
// };
const User = mongoose.model("User", userSchema);
module.exports = User;
