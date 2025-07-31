const mongoose = require('mongoose');
const mailSender= require('../utils/mailSender.js');
const  emailTemplate = require('../Mail/Template/EmaiVerification.js');

const otpSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
    },
    otp:{
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // OTP expires after 5 minutes
    },
})

async function sendverificationEmail(email,otp){
    try{
        await mailSender(email,"verification Email",emailTemplate(otp))
    } catch(error){
        console.log(error);
        throw error
    }
}


otpSchema.pre("save",async function(next){
    if(this.isNew){
        await sendverificationEmail(this.email,"verification Email",emailTemplate(this.otp))
    }
})


module.exports = mongoose.model("OTP", otpSchema);
