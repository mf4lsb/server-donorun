const router = require('express').Router();
const apiController = require('../controllers/ApiController');
const multer = require('multer');
const verifyToken = require('../middlewares/verify_token');
const upload = multer();

// API AUTH
router.post('/register', upload.none(), apiController.registerUser);
router.post('/login', upload.none(), apiController.loginUser);

// API FIND BLOOD
router.get('/volunteer', apiController.volunteerList);
router.post('/add-patient', [upload.none(), verifyToken], apiController.addPatient);
router.post('/blood', [upload.none(), verifyToken], apiController.needBlood);

module.exports = router;