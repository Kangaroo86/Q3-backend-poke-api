const express = require('express');
const router = express.Router();
const deckController = require('./deckController');

/**NOTES :id is NOT the deck's id. It is the user's id. Refactor in the future???**/
router.get('/decks', deckController.getAllDeck);
router.get('/decks/:id(\\d+)', deckController.getDeckById);
router.post('/decks/:id(\\d+)', deckController.createDeck);
router.delete('/decks/:id(\\d+)', deckController.deleteDeck);
router.patch('/decks/:id(\\d+)', deckController.updateDeck);

module.exports = router;
