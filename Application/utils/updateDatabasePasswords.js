const encryption = require('./encryption.js');
const User = require('../models/user.js');


const defaultPassword = 'my_password';

async function updateDatabasePasswords() {
    const encryptedDefaultPassword = await encryption.hashPassword(defaultPassword);
    User.updateMany({password: "<put the encrypted password here>"}, {password: encryptedDefaultPassword}).then((result)=>{
        console.log(result)
    })
  }
  
module.exports = {
    updateDatabasePasswords
}