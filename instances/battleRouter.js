const express = require('express');
const router = express.Router();
const battleController = require('./battleController');

router.get('/battle', battleController.requestBattle); //wip
router.post('/battle/:id(\\d+)', battleController.createBattle); //wip

module.exports = router;
