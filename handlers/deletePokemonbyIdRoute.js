const PokemonData = require('../models/pokemons');

const deletePokemonById = {
    method: 'DELETE',
    handler: async function (request, h) {
        const { id } = request.query;

        if (!id) {
            return h.response({ message: 'Please provide a valid Pokémon ID!' }).code(400);
        }

        try {
            const result = await PokemonData.deleteOne({ id: parseInt(id, 10) }); 

            if (result.deletedCount === 0) {
                return h.response({
                    message: `No pokemon found with ID: ${id}.`,
                }).code(404);
            }

            return h.response({
                message: `Pokémon with ID: ${id} has been deleted successfully.`,
            }).code(200);
        } catch (error) {
            console.error('Error deleting Pokémon:', error);
            return h.response({
                message: 'Error while deleting the Pokémon from the database.',
                error: error.message,
            }).code(500);
        }
    },
};

module.exports = deletePokemonById;