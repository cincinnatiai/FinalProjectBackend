const Joi = require('joi');
const PokemonData = require('../models/pokemons');

const deleteSchema = Joi.object({
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

const deletePokemonHandler = async (request, h) => {
  try {
    const { error, value } = deleteSchema.validate(request.query, {
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
    const result = await PokemonData.deleteOne({ id });
    if (result.deletedCount === 0) {
      return h
        .response({
          message: `No Pokemon found with ID: ${id}.`,
        })
        .code(404);
    }

    return h
      .response({
        message: `Pokemon with ID: ${id} has been deleted successfully.`,
      })
      .code(200);
  } catch (err) {
    return h
      .response({
        message: 'Error while deleting the Pokmon from the database.',
        error: err.message,
      })
      .code(500);
  }
};

module.exports = {
  method: 'DELETE',
  handler: deletePokemonHandler,
};
