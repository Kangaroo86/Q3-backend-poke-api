const express = require('express');
const router = express.Router();
const deckController = require('./deckController');

/**NOTES :id is NOT the deck's id. It is the user's id. Refactor in the future???**/
//router.get('/decks', deckController.getAllDeck);
//router.get('/decks/:id(\\d+)', deckController.getDeckById); //need update
// router.post('/decks/:id(\\d+)', deckController.createDeck);
// router.delete('/decks/:id(\\d+)', deckController.deleteDeck);
// router.patch('/decks/:id(\\d+)', deckController.updateDeck);

router.get('/decks', deckController.getAllDeck); //not used in production
router.get('/users/:id(\\d+)/decks', deckController.getDeckById);
router.post('/users/:id(\\d+)/decks', deckController.createDeck);
router.delete(
  '/users/:id(\\d+)/decks/:deckid(\\d+)',
  deckController.deleteDeck
);
router.patch('/users/:id(\\d+)/decks/:deckid(\\d+)', deckController.updateDeck);

module.exports = router;
