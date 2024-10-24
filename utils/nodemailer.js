const crypto = require('crypto');
const nodemailer = require('nodemailer');

const generateOTP = () => {
    return crypto.randomInt(100000, 999999);
};


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'deepaknehra416@gmail.com',
        pass: process.env.NODEMAILER_PWD
    }
});

const sendOTP = (clientId) => {
    const otp = generateOTP();
    const mailOptions = {
        from: 'deepaknehra416@gmail.com',
        to: clientId,
        subject: 'OTP Verification for the Confirmation of Fund Raise',
        text: `Your OTP ${otp} for Raising fund confirmation on our website \n Thanq you !!`
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.log("Email not Sent : ", err)
        // else console.log("Email Sent : ", info)
    })

    return otp;
}

module.exports = sendOTP;