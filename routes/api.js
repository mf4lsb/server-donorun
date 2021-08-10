const router = require('express').Router();
const apiController = require('../controllers/ApiController');
const multer = require('multer');
const upload = multer();


router.post('/register', upload.none(), apiController.registerUser);
router.post('/login', upload.none(), apiController.loginUser);
router.get('/volunteer', apiController.volunteerList);

module.exports = router;