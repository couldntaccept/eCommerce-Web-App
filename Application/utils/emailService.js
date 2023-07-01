const nodemailer = require('nodemailer');

// Replace the following with your email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'shrivnosqqcwrma6494@gmail.com',
      pass: 'ugmrfitvknpdjplt'
    }
});

async function sendVerificationEmail(email, token) {
  const verificationLink = `https://oldphonedeals.onrender.com/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: '',
    to: email,
    subject: 'Please verify your email address',
    html: `
      <h2>Thank you for registering!</h2>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${verificationLink}">${verificationLink}</a>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending verification email: ${error}`);
  }
}

async function sendPasswordResetEmail(email, token) {
  const passwordResetLink = `https://oldphonedeals.onrender.com/new-password/${token}`;

  const mailOptions = {
    from: '',
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h2>Password Reset Request</h2>
      <p>Please click the link below to reset your password:</p>
      <a href="${passwordResetLink}">${passwordResetLink}</a>

      <p>If you did not request to reset your password, please ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending password reset email: ${error}`);
  }
}


async function sendPasswordChangeEmail(email) {
  const mailOptions = {
    from: '',
    to: email,
    subject: 'Your password has been changed',
    html: `
      <h2>Your Password Has Been Changed</h2>
      <p>This is a confirmation that the password for your account ${email} has just been changed.</p>
      <p>If you did not make this change, please contact support immediately.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password change email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending password change email: ${error}`);
  }
}

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangeEmail, // export the new function
};
