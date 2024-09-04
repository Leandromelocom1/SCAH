const express = require('express');
const router = express.Router();
const { uploadManual } = require('../controllers/ManualController');

router.post('/upload-manual', uploadManual);

module.exports = router;
