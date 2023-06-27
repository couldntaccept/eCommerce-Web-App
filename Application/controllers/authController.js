const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { sendVerificationEmail, sendPasswordResetEmail, sendPasswordChangeEmail} = require('../utils/emailService');

// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';


exports.register = async (req, res) => {
  const { email, password, firstname, lastname } = req.body;

  try {
    const user = new User({ email, password, firstname, lastname , isVerified: false});
    await user.save();

    const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');

    // Send the verification email
    await sendVerificationEmail(email, token);

    res.status(200).send({ message: 'Registration successful, please check your email for verification link' });
  } catch (err) {
    return res.status(422).send(err.message);
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const { userId } = jwt.verify(token, 'MY_SECRET_KEY');
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    user.isVerified = true;
    await user.save();

    res.status(200).send('Email verification successful, you can now log in');
  } catch (err) {
    return res.status(422).send('Email verification failed');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send('Email and password are required');
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(422).send('Invalid email or password');
  }

  // Check if the user's email is verified
  if ( typeof(user.isVerified) !== "undefined" && user.isVerified === false) {
    return res.status(422).send('Please verify your email before logging in');
  }


  
  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return res.status(422).send('Invalid email or password');
  }

  const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
  res.send({ token: token,
            firstName: user.firstname,
            lastName: user.lastname,
            email: user.email,
            userId: user._id 
          });
};


exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, 'MY_SECRET_KEY');
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};


exports.requestResetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    const token = jwt.sign({ id: user._id }, "MY_SECRET_KEY");

    await sendPasswordResetEmail(email, token);

    return res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending password reset email' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { newPassword, token } = req.body;

    if ( !token || !newPassword) {
      console.log(newPassword)
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const decoded = jwt.verify(token, "MY_SECRET_KEY");
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword;
    sendPasswordChangeEmail(user.email);

    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    console.error(error);
    res.status(500).json({ message: 'Error resetting password' });
  }
};
