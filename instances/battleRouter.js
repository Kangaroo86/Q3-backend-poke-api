const express = require('express');
const router = express.Router();
const battleController = require('./battleController');

router.post('/battle', battleController.createBattle);
router.post('/battle/state', battleController.setBattleState);
router.delete('/battle/:battleId(\\d+)', battleController.deleteBattleState);
router.get('/battle/:battleId(\\d+)/state', battleController.getBattleState);

module.exports = router;
