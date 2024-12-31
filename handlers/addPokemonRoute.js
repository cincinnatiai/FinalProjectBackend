const PokemonData = require('../models/pokemons');

const addPokemon = {
    method: 'POST',
    handler: async function (request, h) {
        const newPokemon = request.payload; 

        if (!newPokemon.id) {
            return h.response({ message: 'A Pokémon ID is required!' }).code(400);
        }
        try {
            const existingPokemon = await PokemonData.findOne({ id: newPokemon.id });

            if (existingPokemon) {
                return h.response({
                    message: `A Pokémon with ID: ${newPokemon.id} already exists.`,
                }).code(409); 
            }
            const pokemon = new PokemonData(newPokemon);
            await pokemon.save();

            return h.response({
                message: 'Pokémon added successfully!',
                data: newPokemon,
            }).code(201); 
        } catch (error) {
            console.error('Error adding Pokémon:', error);
            return h.response({
                message: 'Error while adding the Pokémon.',
                error: error.message,
            }).code(500);
        }
    },
};

module.exports = addPokemon;