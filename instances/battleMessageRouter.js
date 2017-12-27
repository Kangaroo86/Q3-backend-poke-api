const express = require('express');
const router = express.Router();
const battleMessageController = require('./battleMessageController');

router.get(
  '/message/battle/:battleId(\\d+)',
  battleMessageController.getAllMessages
);
//router.post('/message', battleMessageController.createMessage);

module.exports = router;
