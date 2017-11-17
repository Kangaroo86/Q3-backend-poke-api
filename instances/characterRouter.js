const express = require('express');
const router = express.Router();
const characterController = require('./characterController');

router.get('/characters', characterController.getAllCharacters);

module.exports = router;
