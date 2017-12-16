const express = require('express');
const router = express.Router();
const battleController = require('./battleController');

router.post('/battle', battleController.requestBattle);
router.post('/battle/:userId(\\d+)', battleController.createBattle);

module.exports = router;
