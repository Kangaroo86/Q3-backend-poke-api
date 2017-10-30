const Yup = require('yup');

const Validator = require('../validators/Validator');

const { DEBUG } = require('../../env');

const schemas = {
  forCreate: {
    name: Yup.string().trim().required().min(2),
    wins: Yup.number().required().positive().integer(),
    losses: Yup.number().required().positive().integer()
  },
  forUpdate: {
    name: Yup.string().trim().min(2)
  }
};

module.exports = new Validator({
  name: 'Deck',
  schemas,
  logError: DEBUG ? console.error : undefined // eslint-disable-line no-console
});
