const Joi = require('joi');
const PokemonData = require('../models/pokemons');
const pokemonSchema = Joi.object({
  id: Joi.number()
    .required()
    .messages({
      'any.required': 'Pokemon ID is required!',
      'number.base': 'Pokeon ID must be a number!',
    }),

  name: Joi.string()
    .required()
    .messages({
      'any.required': 'Pokemon name is required!',
      'string.base': 'Pokemon name must be a string!',
    }),

  abilities: Joi.array()
    .items(Joi.string().required())
    .min(1)
    .required()
    .messages({
      'any.required': 'Pokemon abilities are required!',
      'array.base': 'Pokemon abilities must be an array of strings!',
      'array.min': 'Pokemon must have at least one ability.',
    }),

  weight: Joi.number()
    .required()
    .messages({
      'any.required': 'Pokemon weight is required!',
      'number.base': 'Pokemon weight must be a number!',
    }),

  height: Joi.number()
    .required()
    .messages({
      'any.required': 'Pokemon height is required!',
      'number.base': 'Pokemon height must be a number!',
    }),

  types: Joi.array()
    .items(Joi.string().required())
    .min(1)
    .required()
    .messages({
      'any.required': 'Pokemon types are required!',
      'array.base': 'Pokemon types must be an array of strings!',
      'array.min': 'Pokemon must have at least one type.',
    }),

  image: Joi.string()
    .uri()
    .required()
    .messages({
      'any.required': 'Pokemon image is required!',
      'string.uri': 'Pokemon image must be a valid URI!',
    }),
});

const addPokemonHandler = async (request, h) => {
  try {
    const { error, value: newPokemon } = pokemonSchema.validate(request.payload, {
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
    const existingPokemon = await PokemonData.findOne({ id: newPokemon.id });
    if (existingPokemon) {
      return h
        .response({
          message: `A Pokemon with ID: ${newPokemon.id} already exists.`,
        })
        .code(409);
    }
    const pokemon = new PokemonData(newPokemon);
    await pokemon.save();
    return h
      .response({
        message: 'Pokémon added successfully!',
        data: newPokemon,
      })
      .code(201);
  } catch (err) {
    return h
      .response({
        message: 'Error while adding the Pokémon.',
        error: err.message,
      })
      .code(500);
  }
};

module.exports = {
  method: 'POST',
  handler: addPokemonHandler,
};
