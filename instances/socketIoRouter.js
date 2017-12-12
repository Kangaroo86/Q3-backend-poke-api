const express = require('express');
const router = express.Router();
const socketIoController = require('./socketIoController');

router.get('/socket', socketIoController.getSocketIo);

module.exports = router;
