import nodemaler from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

class Email {
  constructor() {
    this.emailAddress = process.env.EMAIL_USER;
    this.transporter = nodemaler.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail(email, subject, body) {
    console.log(email);
    try {
      await this.transporter.sendMail({
        from: this.emailAddress,
        to: email,
        subject: subject,
        html: body,
      });
    } catch (err) {
      console.log(err);
      throw new Error("Error sending email");
    }
  }

    otpSubject() {
      return "BabySitter - OTP for login";
    }

    otpBody(otp) {
      return `
        <div style="text-align: center; font-family: Arial, sans-serif;">
          <h1 style="color: #444;">Welcome to Our Service</h1>
          <p>Your OTP for login is:</p>
          <p style="font-size: 24px; color: #007BFF;"><strong>${otp}</strong></p>
          <p>Please enter this OTP within 5 minutes to complete your login.</p>
        </div>
      `;
    }

  passSetSubject() {
    return "Welcome to Our Service";
  }
  
  passSetBody(token) {
    return `
  <div style="text-align: center; font-family: Arial, sans-serif;">
      <h1 style="color: #444;">Welcome to Our Service</h1>
      <p style="color: #666;">
          Thank you for registering. To complete your registration, please set up your password.
      </p>
      <a href="http://localhost:5050/resetPassword/${token}" style="display: inline-block; margin: 20px auto; padding: 10px 20px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 4px;">
          Set Up Password
      </a>
      <p style="color: #666;">
          If you did not register for our service, please ignore this email.
      </p>
  </div>
`;
  }
}

export default Email;
