const express = require('express');
const router = express.Router();
const battleController = require('./battleController');

router.get('/battle', battleController.getAllCards); //wip
router.post('/battle', battleController.createCard); //wip
router.delete('/battle/:id(\\d+)', battleController.deleteCard); //wip

module.exports = router;
