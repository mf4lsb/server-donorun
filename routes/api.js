const router = require('express').Router();
const apiController = require('../controllers/ApiController');
const multer = require('multer');
const upload = multer();

// API AUTH
router.post('/register', upload.none(), apiController.registerUser);
router.post('/login', upload.none(), apiController.loginUser);

// API FIND BLOOD
router.get('/volunteer', apiController.volunteerList);
router.post('/add-patient', upload.none(), apiController.addPatient);

module.exports = router;