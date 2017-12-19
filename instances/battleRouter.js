const express = require('express');
const router = express.Router();
const battleController = require('./battleController');

router.post('/battle', battleController.createBattle);
router.post('/battle/state', battleController.setBattleState);
router.get('/battle/:battleId(\\d+)/state', battleController.getBattleState);

module.exports = router;
