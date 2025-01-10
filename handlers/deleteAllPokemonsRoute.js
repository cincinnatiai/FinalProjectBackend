const PokemonData = require('../models/pokemons');

const deleteAllPokemons = {
    method: 'DELETE',
    handler: async function (request, h) {
        try {
            const result = await PokemonData.deleteMany({}); 
            return h.response({
                message: 'All Pokémon have been deleted successfully.',
                deletedCount: result.deletedCount, 
            }).code(200);
        } catch (error) {
            return h.response({
                message: 'Error while deleting Pokémon from the database.',
                error: error.message,
            }).code(500);
        }
    },
};

module.exports = deleteAllPokemons;