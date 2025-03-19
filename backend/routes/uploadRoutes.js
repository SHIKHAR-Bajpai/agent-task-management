const express = require('express');
const { uploadCSVAndDistribute , getAllTask } = require('../controllers/uploadController');
const auth = require('../middlewares/authMiddleware');
const router = express.Router();

// Route for getting task and file upload by admin
router.get('/tasks' , auth(['admin']) , getAllTask )
router.post('/upload', auth(['admin']), uploadCSVAndDistribute);

module.exports = router;
