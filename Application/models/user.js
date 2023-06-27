const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const encryption = require('../utils/encryption.js');


const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: { 
        type: Boolean
    },

})

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
      this.password = await encryption.hashPassword(this.password);
    }
    next();
});


userSchema.methods.comparePassword = function (candidatePassword) {
    return encryption.checkPassword(candidatePassword, this.password);
};

//connects a schema with the name 'user'

module.exports = mongoose.model('User', userSchema)