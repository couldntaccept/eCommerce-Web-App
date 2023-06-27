const bcrypt = require('bcrypt');

// Define the number of hashing rounds (more rounds, more secure but slower)
const saltRounds = 10;


async function hashPassword(plainPassword) {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    console.log('Hashed password:', hashedPassword);
    return hashedPassword;
  } catch (error) {
    console.error('Error while hashing password:', error);
  }
}

// Example usage
// hashPassword('my_password');

async function checkPassword(plainPassword, hashedPassword) {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('Do the passwords match?', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Error while comparing passwords:', error);
  }
}

// Example usage
// const plainPassword = 'my_password';
// const hashedPassword = '$2b$10$Svng4PmHW0.Kh1hlL3942.zym/CZCD316NxsiHnEhYki.Pgt/Z4k6'; // This should be the output of the hashPassword function
// checkPassword(plainPassword, hashedPassword);

module.exports = {
    hashPassword,
    checkPassword
}