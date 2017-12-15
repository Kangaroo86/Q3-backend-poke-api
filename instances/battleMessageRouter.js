const express = require('express');
const router = express.Router();
const battleMessageController = require('./battleMessageController');

router.get('/message/:battleId(\\d+)', battleMessageController.getMessage);
router.post('/message', battleMessageController.createMessage);

module.exports = router;
