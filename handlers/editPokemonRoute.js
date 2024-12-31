const PokemonData = require('../models/pokemons');

const editPokemon = {
    method: 'PUT',
    handler: async function (request, h) {
        const { id } = request.query;

        if (!id) {
            return h.response({ message: 'Please provide a valid Pokémon ID!' }).code(400);
        }

        const updates = request.payload; 

        try {
            const result = await PokemonData.updateOne(
                { id: parseInt(id, 10) }, 
                { $set: updates }
            );

            if (result.matchedCount === 0) {
                return h.response({
                    message: `No Pokémon found with ID: ${id}.`,
                }).code(404);
            }

            return h.response({
                message: `Pokémon with ID: ${id} updated successfully.`,
                updatedFields: updates,
            }).code(200);
        } catch (error) {
            console.error('Error updating Pokémon:', error);
            return h.response({
                message: 'Error while updating the Pokémon.',
                error: error.message,
            }).code(500);
        }
    },
};

module.exports = editPokemon;