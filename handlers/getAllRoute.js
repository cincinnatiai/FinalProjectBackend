const PokemonData = require('../models/pokemons');

const saveAllPokemonsHandler = async (request, h) => {
  try {
    const savePokemon = async (id) => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);

      if (!response.ok) {
        return h.response({
          error: 'Wasn’t able to fetch data from the API.',
        }).code(400);
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
    for (let id = 1; id <= 100; id += 1) {
      promises.push(savePokemon(id));
    }
    await Promise.all(promises);

    return h
      .response({
        message: 'Fetched and saved Pokemon data for IDs 1 to 100.',
      })
      .code(200);
  } catch (error) {
    return h
      .response({
        message: 'Error while fetching Pokemon data.',
        error: error.message,
      })
      .code(500);
  }
};

module.exports = {
  method: 'GET',
  handler: saveAllPokemonsHandler,
};
