const mongoose = require("mongoose");
const Notes = require("./notes");


const userSchema = mongoose.Schema({
  firstName: {
    required: true,
    type: String,
    trim: true,
  },
  lastName: {
    required: true,
    type: String,
    trim: true,
  },
  email: {
    required: true,
    type: String,
    trim: true,
    validate: {
      validator: (value) => {
        const re =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return value.match(re);
      },
      message: "Please enter a valid email address",
    },
  },
  password: {
    required: true,
    type: String,
    trim:true,
    validator: (value) => {
      return value.length > 6;
    },
    message: "Please insert a long Password",
  },
  address: {
    required: true,
    type: String,
    trim: true,
  },
  contact: {
    required: true,
    type: String,
    trim: true,
  },

  //for events
  notes: [Notes.schema],

});


const User = mongoose.model("User", userSchema);
module.exports = User;
