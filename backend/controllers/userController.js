const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const APIError = require('../config/APIError');
const Notif = require('../models/notifModel');

// @desc Random user generator
// @route POST /api/randomuser
// @access public
const sampleDataInsert = async (req, res) => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let k = 0; k < 1000; k++) {
        const fname = charGen(5, chars);
        const lname = fname;
        const email = fname;
        const password = fname;
        const isAdmin = false;
        const createdAt = new Date;

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            fname, lname, email, password: hashedPassword, isAdmin, createdAt
        });
    }

    res.status(200).send('Ok');

    function charGen(length, chars) {
        let result = "";
        for (let i = length; i > 0; i--) {
            result += chars[Math.round(Math.random() * (chars.length - 1))];
        }
        return result;
    }
}

// @desc Register user
// @route POST /api/register
// @access public
const registerUser = async (req, res, next) => {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const password = req.body.password;
    const isAdmin = false;
    // const { name, email, password } = req.body;
    if (!fname || !lname || !email || !password) {
        next(APIError.badRequest('Please add all the fields'));
        return;
    }

    // Check if user exists already
    const userExists = await User.findOne({ email });
    if (userExists) {
        next(APIError.conflict('User already exists'));
        return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        fname, lname, email, password: hashedPassword, isAdmin
    });
    if (user) {
        const newNotif = {
            isRead: false,
            notifName: 'Registration',
            notifType: 'Registration',
            notifDesc: 'Welcome to GetSetDo',
            notifBy: 'System',
            notifFor: user._id,
            notifIcon: 'app_registration',
            notifDate: Date.now()
        };
        await Notif.create(newNotif);
        res.status(200).json({ success: true, message: 'Registered Successfully' });
    } else {
        next(APIError.badRequest('Invalid user data'));
        return;
    }
}

// @desc Authenticate user
// @route POST /api/users/login
// @access public
const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });
    if (user && (await (bcrypt.compare(password, user.password)))) {
        res.status(200).json({
            _id: user.id,
            fname: user.fname,
            lname: user.lname,
            email: user.email,
            isAdmin: user.isAdmin,
            message: 'Login Success',
            token: generateToken(user._id, user.isAdmin)
        })
    } else {
        next(APIError.unauthorized('Invalid credentials'));
        return;
    }

}

// @desc Authenticate user
// @route POST /api/users/me
// @access private
const getMe = async (req, res, next) => {
    if (req.user) {
        const user = await User.findById(req.user._id);
        res.status(200).json({
            _id: user._id,
            fname: user.fname,
            lname: user.lname,
            email: user.email,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt
        });
    } else {
        next(APIError.notFound('User Data not found'));
        return;
    }
}

const getAllAdmins = async (req, res, next) => {
    try {
        const filter = { isAdmin: true };
        const query = await User.find(filter).select('email');
        res.status(200).json(query);
    } catch (err) {
        next(APIError.internal('Internal Server Error'));
    }
}

const changePassword = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const userId = getUserId(token);

    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    // const confirmPassword = req.body.confirmPassword;

    const user = await User.findById(userId);
    if (await bcrypt.compare(oldPassword, user.password)) {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const filter = { _id: userId }
        const update = { $set: { password: hashedPassword } }
        const query = await User.updateOne(filter, update);

        res.status(200).json({ success: true, message: 'Password changed successfully' });
    } else {
        next(APIError.conflict('Old Password does not match'));
    }
}

const getUserNotifs = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const userId = getUserId(token);

    const user = await User.findById(userId);
    console.log(user);
    const accountCreatedAt = user.createdAt;

    const filter = { notifFor: { $in: ['', userId] }, notifDate: { $gt: accountCreatedAt } };
    const query = await Notif.find(filter).sort({ notifDate: -1 });

    res.status(200).json(query);
}


const markAsRead = async (req, res, next) => {
    const notifId = req.body.notifId;

    const filter = { _id: notifId };

    const notif = await Notif.findOne(filter);
    if (notif.notifType === 'General') {
        next(APIError.conflict('General notifications cannot be marked as read'));
    } else {
        const update = { $set: { isRead: true } };
        const query = await Notif.updateOne(filter, update);

        res.status(200).json({ success: true, message: 'Mark as Read' });
    }

}


// Additional functions
const generateToken = (id, isAdmin) => {
    return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
}

function getUserId(token) {
    const decodedId = jwt.verify(token, process.env.JWT_SECRET).id;
    return decodedId;
}

module.exports = { registerUser, loginUser, getMe, changePassword, getAllAdmins, markAsRead, getUserNotifs, sampleDataInsert };