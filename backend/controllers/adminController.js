const jwt = require('jsonwebtoken');
const APIError = require('../config/APIError');
const User = require('../models/userModel');
const Notif = require('../models/notifModel');

const getUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        let sortBy = req.query.sort;
        const sortOrder = req.query.order;
        const search = req.query.search;

        if (sortOrder === "desc") {
            sortBy = "-" + sortBy;
        }

        // console.log(sortBy, sortOrder);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        let results = {};

        let length = await User.countDocuments();

        // Based on search condition
        if (search) {
            results.result = await User.find({ fname: { $regex: search, $options: 'i' } }).sort(sortBy).skip(startIndex).limit(limit).select('-password').exec();
            length = await results.result.length;
        } else {
            results.result = await User.find({}).sort(sortBy).skip(startIndex).limit(limit).select('-password').exec();
        }

        if (endIndex < length) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        }

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            }
        }
        results.totalCount = length;
        res.status(200).json(results);

    } catch (err) {
        next(APIError.badRequest('Some error occured'));
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const id = req.query.id;

        const filter = { _id: id };
        const result = await User.deleteOne(filter);

        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
        next(APIError.notFound('Unable to delete'));
    }
}

const makeAdmin = async (req, res, next) => {
    try {
        // const token = req.headers.authorization.split(' ')[1];
        // const adminId = getAdminId(token);

        const id = req.body.id;

        const filter = { _id: id };
        const update = { $set: { "isAdmin": true } }
        const result = await User.updateOne(filter, update);

        const newNotif = {
            isRead: false,
            notifName: 'Admin invoked',
            notifType: 'Admin',
            notifDesc: 'You are site admin now',
            notifBy: 'Admin',
            notifFor: id,
            notifIcon: 'verified_user',
            notifDate: Date.now()
        };
        await Notif.create(newNotif);

        res.status(200).json({ success: true, message: 'Admin status invoked' });
    } catch (err) {
        next(APIError.notFound('Unable to make Admin'));
    }
}

const removeAdmin = async (req, res, next) => {
    try {
        const userId = req.body.id;

        const filter = { _id: userId };
        const update = { $set: { "isAdmin": false } }
        const result = await User.updateOne(filter, update);

        const newNotif = {
            isRead: false,
            notifName: 'Admin revoked',
            notifType: 'Admin',
            notifDesc: 'You admin status has been revoked',
            notifBy: 'Admin',
            notifFor: userId,
            notifIcon: 'privacy_tip',
            notifDate: Date.now()
        };
        await Notif.create(newNotif);

        res.status(200).json({ success: true, message: 'Admin status revoked' });
    } catch (err) {
        next(APIError.notFound('Unable to remove Admin'));
    }
}

function getAdminId(token) {
    const decodedId = jwt.verify(token, process.env.JWT_SECRET).id;
    return decodedId;
}

module.exports = { getUsers, deleteUser, makeAdmin, removeAdmin }