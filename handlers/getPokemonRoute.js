const Joi = require('joi');
const PokemonData = require('../models/pokemons');
const querySchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'Pokémon ID is required!',
      'number.base': 'Pokémon ID must be a valid number!',
      'number.integer': 'Pokémon ID must be an integer!',
      'number.positive': 'Pokémon ID must be a positive integer!',
    }),
});

const getPokemonHandler = async (request, h) => {
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

    const { id } = value;
    const existingPokemon = await PokemonData.findOne({ id });
    if (existingPokemon) {
      return h
        .response({
          message: `Fetched Pokémon ${existingPokemon.name} from the database.`,
          data: existingPokemon,
        })
        .code(200);
    }

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    if (!response.ok) {
      return h
        .response({
          message: `Cannot fetch Pokemon with ID: ${id}`,
          error: response.statusText,
        })
        .code(response.status);
    }

    const data = await response.json();
    const pokemonData = {
      id: data.id,
      name: data.name,
      abilities: data.abilities.map((ability) => ability.ability.name),
      weight: data.weight,
      height: data.height,
      types: data.types.map((type) => type.type.name),
      image: data.sprites.front_default,
    };

    await PokemonData.updateOne(
      { id: pokemonData.id },
      { $set: pokemonData },
      { upsert: true }
    );

    return h
      .response({
        message: `Fetched and saved Pokemon ${pokemonData.name} from the API.`,
        data: pokemonData,
      })
      .code(200);
  } catch (err) {
    return h
      .response({
        message: 'Error while processing the request',
        error: err.message,
      })
      .code(500);
  }
};

module.exports = {
  method: 'GET',
  handler: getPokemonHandler,
};
