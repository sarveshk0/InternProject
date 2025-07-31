const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required: true,
    trim:true
  },
  dateOfBirth:{
    type: Date,
    required: true
  },
  email:{
    type:String,
    required: true,
    trim:true,
  },
});

  module.exports=mongoose.model('User', userSchema);