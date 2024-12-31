const PokemonData = require('../models/pokemons');

const getPokemon = {
    method: 'GET',
    handler: async function (request, h) {
        const { id } = request.query;

        if (!id) {
            return h.response({ message: 'Please provide a valid Pokémon ID!' }).code(400);
        }

        try {
            const existingPokemon = await PokemonData.findOne({ id: parseInt(id, 10) });

            if (existingPokemon) {
                return h.response({
                    message: `Fetched Pokémon ${existingPokemon.name} from the database.`,
                    data: existingPokemon,
                }).code(200);
            }

            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);

            if (!response.ok) {
                return h.response({
                    message: `Cannot fetch Pokémon with ID: ${id}`,
                    error: response.statusText,
                }).code(response.status);
            }

            const data = await response.json();

            const pokemonData = {
                id: data.id,
                name: data.name,
                abilities: data.abilities.map(ability => ability.ability.name),
                weight: data.weight,
                height: data.height,
                types: data.types.map(type => type.type.name),
                image: data.sprites.front_default,
            };

            await PokemonData.updateOne(
                { id: pokemonData.id },
                { $set: pokemonData },
                { upsert: true }
            );

            return h.response({
                message: `Fetched and saved Pokémon ${pokemonData.name} from the API.`,
                data: pokemonData,
            }).code(200);
        } catch (error) {
            return h.response({
                message: 'Error while processing the request',
                error: error.message,
            }).code(500);
        }
    },
};

module.exports = getPokemon;
