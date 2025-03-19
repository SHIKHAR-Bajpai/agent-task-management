const express = require('express');
const { addAgent, updateAgent, deleteAgent , getAgents } = require('../controllers/agentController');
const auth = require('../middlewares/authMiddleware');
const router = express.Router();

// Routes for add , updating and deleting agents by admin
router.get('/get-agents' , auth(['admin']) , getAgents )
router.post('/add', auth(['admin']), addAgent);
router.put('/update/:id' , auth(['admin']) , updateAgent),
router.delete('/delete/:id' , auth(['admin']) , deleteAgent)

module.exports = router;
