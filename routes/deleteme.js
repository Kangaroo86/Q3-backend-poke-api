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

router.get('/decks', (request, response, next) => {
  const scope = {};
  knex('Deck')
    .then(decks => {
      scope.decks = decks;
      const promises = decks.map(deck =>
        knex('Character').whereIn(
          'id',
          knex('Card').select('characterId').where({ deckId: deck.id })
        )
      );
      return Promise.all(promises);
    })
    .then(results => {
      const { decks } = scope;
      decks.forEach((deck, i) => {
        deck.cards = results[i];
      });
      response.json(decks);
    })
    // .innerJoin('Card', 'Deck.id', 'Card.deckId')
    // .innerJoin('Character', 'Card.characterId', 'Character.id')
    // .returning('*')
    // // .first()
    // //.orderBy('deckname', 'asc')
    // .then(deck => {
    //   console.log('this deck----', deck);
    //   let newObj = {
    //     deckId: '',
    //     deckName: '',
    //     wins: '',
    //     losses: '',
    //     pokeObj: []
    //   };
    //   deck.forEach(data => {
    //     newObj.deckId = data.id;
    //     newObj.deckName = data.deckname;
    //     newObj.wins = data.wins;
    //     newObj.losses = data.losses;
    //     newObj.pokeObj.push({ name: data.name, pokemonId: data.pokemonId });
    //   });
    //   //console.log('this OBJ--------', newObj);
    //   return response.json(newObj);
    // })
    .catch(err => {
      next(err);
    });
});

router.get('/decks/:id(\\d+)', (request, response, next) => {
  let someId = parseInt(request.params.id);
  if (someId < 0 || someId > 100 || isNaN(someId) === true) {
    response.set('Content-Type', 'text/plain').status(404).send('Not Found');
  } else {
    knex('Deck')
      .where('id', request.params.id)
      .first()
      .then(deck => {
        if (!deck) {
          return next();
        }
        response.json(deck);
      })
      .catch(err => {
        next(err);
      });
  }
});
