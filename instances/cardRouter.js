const express = require('express');
const router = express.Router();
const cardController = require('./cardController');

router.get('/cards', cardController.getAllCards);
router.post('/cards', cardController.createCard);
router.delete('/cards/:id(\\d+)', cardController.deleteCard);

module.exports = router;
