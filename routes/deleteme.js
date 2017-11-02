GET / decks / 1;

let newObj = {
  deckId: 1,
  name: 'starterdeck',
  wins: 5,
  losses: 5,
  cards: [
    {
      name: 'Bulasausr',
      pokemonId: 1
    },
    {
      name: 'charmander',
      pokemonId: 2
    }
  ]
};

//GET / decks / 1 / cards;

router.get('/decks', (request, response, next) => {
  knex
    .from('Deck')
    .innerJoin('Card', 'Deck.id', 'Card.deckId')
    .innerJoin('Character', 'Card.characterId', 'Character.id')
    .returning('*')
    .then(deck => {
      response.json(deck);
    })
    .catch(err => {
      next(err);
    });
});

[
  {
    characterId: 1,
    deckId: 1,
    id: 1,
    losses: 6,
    name: 'Bulbasaur',
    pokemonId: 1,
    userId: 1,
    wins: 5
  },
  {
    characterId: 2,
    deckId: 1,
    id: 2,
    losses: 6,
    name: 'Charmander',
    pokemonId: 4,
    userId: 1,
    wins: 5
  }
];
