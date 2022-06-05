const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, sampleDataInsert } = require('../controllers/userController');

const { getAllAdmins, changePassword, getUserNotifs, markAsRead } = require('../controllers/userController');

const { protect } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

// random user generator route
router.get('/randomuser', sampleDataInsert);

// other routes
router.get('/getAllAdmins', protect, getAllAdmins);
router.put('/changePassword', protect, changePassword);

// get user notifs
router.get('/getUserNotifs', protect, getUserNotifs);

// mark notif read
router.put('/markAsRead', protect, markAsRead);

module.exports = router;