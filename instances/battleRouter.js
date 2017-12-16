const express = require('express');
const router = express.Router();
const battleController = require('./battleController');

router.post('/battle', battleController.requestBattle);
router.post('/battle/:userId(\\d+)', battleController.createBattle);
router.post('/battle/state', battleController.setBattleState);
router.get('/battle/state', battleController.getBattleState);

module.exports = router;
