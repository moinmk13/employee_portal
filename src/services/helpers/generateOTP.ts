
import sendEmail from "../../utils/emailSender";
import config from "../../config/config";
import  User from "../../models/user.model";
import lang from "../../utils/language/english"

function generateOTP(): string {
  // Generate a 6-digit random OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
}
type body = { email: string, subject: string, message: string }
async function verifyEmail(props: body, otp?: number) {
  const emailOptions = {
    from: config.email.from,
    to: props.email,
    subject: props.subject,
    text: props.message,
  };
  const res = await sendEmail(emailOptions)
    .then(response => {
      return response
    })
    .catch(error => {
      return error
    });

  if (res.message === "Email sent successfully!") {
    const data = {
      otp: otp,
      email: props.email
    }
    const email = props.email;
    const user = await User.findOne({ email });

    if (user) {
      // Update existing user with new OTP and email
      user.set(data);
      await user.save();
    } else {
      // Create a new user if not found
      await User.create(data);
    }

    return {
      status_code: 200,
      message: lang.otpEmail.sendVerificationCodeSuccess
    };
  }

}
export {
  generateOTP,
  verifyEmail
}