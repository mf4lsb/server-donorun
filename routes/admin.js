const router = require('express').Router();
const adminController = require('../controllers/AdminController');
const multer = require('multer');
const upload = multer();

// NOTE: AUTHENTICATION
router.get('/', adminController.viewLogin);
router.post('/login', adminController.loginAdmin);
router.post('/register', upload.none(), adminController.registerAdmin);

// NOTE: DASHBOARD
router.get('/dashboard', adminController.viewDashboard);
router.get('/auth-user', adminController.viewAuthUser);
router.post('/auth-user/register', adminController.registerUser);
router.post('/auth-user/login', adminController.loginUser);

// NOTE: POST
router.get('/posting-page', adminController.viewArticle);

// NOTE: BLOOD
router.get('/blood-page', adminController.viewBlood);

// NOTE: USER
router.get('/user-page', adminController.viewUser);

// NOTE HISTORY
router.get('/history-page', adminController.viewHistory);
router.post('/history-page/donor', adminController.addNewDonor);
router.post('/verify', adminController.verify);

module.exports = router;