const express = require('express');
const router = express.Router();
const battleController = require('./battleController');

router.get('/battle', battleController.requestBattle);
router.post('/battle/:battleId(\\d+)', battleController.createBattle);

module.exports = router;
