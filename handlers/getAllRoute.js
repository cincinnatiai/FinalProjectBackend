const PokemonData = require('../models/pokemons'); 
const Hapi = require('@hapi/hapi');


const saveAllPokemons = {
    method: 'GET',
    path: '/pokemon/fetchAll',
    handler: async function (request, h) {
        try {
            const savePokemon = async (id) => {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
                if (!response.ok) {
                    return h.response({
                        error: `Wasnt able to fetch from api`,
                    }).code(400)
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
                return pokemonData;
            };

            const promises = [];
            for (let id = 1; id <= 100; id++) {
                promises.push(savePokemon(id));
            }

            await Promise.all(promises);

            return h.response({
                message: 'Fetched and saved Pokémon data for IDs 1 to 1000.',
            }).code(200);
        } catch (error) {
            console.error('Error during batch fetch:', error);
            return h.response({
                message: 'Error while fetching Pokémon data',
                error: error.message,
            }).code(500);
        }
    },
};
module.exports = saveAllPokemons;