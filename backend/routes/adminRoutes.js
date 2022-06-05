const express = require('express');
const router = express.Router();

const { adminProtect } = require('../middlewares/adminMiddleware');

const { getUsers } = require('../controllers/adminController');
const { deleteUser } = require('../controllers/adminController');

const { makeAdmin } = require('../controllers/adminController');
const { removeAdmin } = require('../controllers/adminController');

// getting all users
router.get('/getUsers', adminProtect, getUsers);

// deleting a user
router.delete('/deleteUser', adminProtect, deleteUser);

// Adding admin status
router.put('/removeAdmin', adminProtect, removeAdmin);

// Removing admin status
router.put('/makeAdmin', adminProtect, makeAdmin);

module.exports = router;