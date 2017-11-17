const express = require('express');
const router = express.Router();
const deckController = require('./deckController');

router.get('/decks', deckController.getAllDeck);
router.get('/decks/:id(\\d+)', deckController.getDeckById);
router.post('/decks/:id(\\d+)', deckController.createDeck);
router.delete('/decks/:id(\\d+)', deckController.deleteDeck);

module.exports = router;
