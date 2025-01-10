const Joi = require('joi');
const PokemonData = require('../models/pokemons');
const querySchema = Joi.object({
  page: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'Page is required!',
      'number.base': 'Page must be a valid number!',
      'number.integer': 'Page must be an integer!',
      'number.positive': 'Page must be a positive integer!',
    }),
});

const pagePokemonsHandler = async (request, h) => {
  try {
    const { error, value } = querySchema.validate(request.query, {
      abortEarly: false,
    });

    if (error) {
      return h
        .response({
          message: 'Validation error',
          details: error.details.map((detail) => detail.message),
        })
        .code(400);
    }

    const { page } = value;
    const toPokemon = page * 10;
    const fromPokemon = toPokemon - 9;
    const resultsPage = await PokemonData.find({
      id: { $gte: fromPokemon, $lte: toPokemon },
    });

    if (resultsPage.length === 0) {
      return h
        .response({
          error: 'Choose a valid page!',
        })
        .code(404);
    }

    return h
      .response({
        message: 'Pokemons found!',
        data: resultsPage,
      })
      .code(200);
  } catch (err) {
    return h
      .response({
        message: 'Error while processing the request.',
        error: err.message,
      })
      .code(500);
  }
};

module.exports = {
  method: 'GET',
  handler: pagePokemonsHandler,
};
