const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;