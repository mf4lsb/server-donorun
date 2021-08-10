const router = require('express').Router();
const adminController = require('../controllers/AdminController');

router.get('/dashboard', adminController.viewDashboard);
router.get('/auth-user', adminController.viewAuthUser);
router.post('/auth-user/register', adminController.registerUser);
router.post('/auth-user/login', adminController.loginUser);

module.exports = router;