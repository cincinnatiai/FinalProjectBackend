const Joi = require('joi');
const PokemonData = require('../models/pokemons');

const querySchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'Pokemon ID is required!',
      'number.base': 'Pokemon ID must be a valid number!',
      'number.integer': 'Pokemon ID must be an integer!',
      'number.positive': 'Pokemon ID must be a positive integer!',
    }),
});

const updateSchema = Joi.object({
  name: Joi.string().messages({
    'string.base': 'Pokemon name must be a string!',
  }),

  abilities: Joi.array()
    .items(Joi.string())
    .min(1)
    .messages({
      'array.base': 'Pokemon abilities must be an array of strings!',
      'array.min': 'Pokemon must have at least one ability.',
    }),

  weight: Joi.number().messages({
    'number.base': 'Pokemon weight must be a number!',
  }),

  height: Joi.number().messages({
    'number.base': 'Pokemon height must be a number!',
  }),

  types: Joi.array()
    .items(Joi.string())
    .min(1)
    .messages({
      'array.base': 'Pokemon types must be an array of strings!',
      'array.min': 'Pokemon must have at least one type.',
    }),

  image: Joi.string()
    .uri()
    .messages({
      'string.uri': 'Pokemon image must be a valid URI!',
    }),
});

const editPokemonHandler = async (request, h) => {
  try {
    const { error: queryError, value: validatedQuery } = querySchema.validate(request.query, {
      abortEarly: false,
    });

    if (queryError) {
      return h
        .response({
          message: 'Validation error',
          details: queryError.details.map((detail) => detail.message),
        })
        .code(400);
    }
    const { error: payloadError, value: validatedPayload } = updateSchema.validate(request.payload, {
      abortEarly: false,
    });

    if (payloadError) {
      return h
        .response({
          message: 'Validation error',
          details: payloadError.details.map((detail) => detail.message),
        })
        .code(400);
    }

    const { id } = validatedQuery;
    const result = await PokemonData.updateOne(
      { id: parseInt(id, 10) },
      { $set: validatedPayload }
    );

    if (result.matchedCount === 0) {
      return h
        .response({
          message: `No Pokemon found with ID: ${id}.`,
        })
        .code(404);
    }

    return h
      .response({
        message: `Pokemon with ID: ${id} updated successfully.`,
        updatedFields: validatedPayload,
      })
      .code(200);
  } catch (error) {
    return h
      .response({
        message: 'Error while updating the Pokemon.',
        error: error.message,
      })
      .code(500);
  }
};

module.exports = {
  method: 'PUT',
  handler: editPokemonHandler,
};
