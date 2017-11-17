const express = require('express');
const router = express.Router();
const deckController = require('./deckController');

router.get('/decks', deckController.getAllDeck);
router.get('/decks/:id(\\d+)', deckController.getDeckById);

module.exports = router;
