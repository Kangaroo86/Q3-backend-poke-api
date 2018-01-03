const express = require('express');
const router = express.Router();
const deckController = require('./deckController');

router.get('/decks', deckController.getAllDeck); //not used in production
router.get('/users/:id(\\d+)/decks', deckController.getDeckById); //good
router.post('/users/:id(\\d+)/decks', deckController.createDeck); //good
router.delete('/decks/:deckid(\\d+)', deckController.deleteDeck); //good
router.patch('/decks/:deckid(\\d+)', deckController.updateDeck); //good

module.exports = router;
