const PokemonData = require('../models/pokemons');

const saveAllPokemonsHandler = async (request, h) => {
  try {
    const savePokemon = async (id) => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
        if (!response.ok) {
          console.error(`Failed to fetch data for Pokemon ID: ${id}`);
          return null;
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

        const result = await PokemonData.updateOne(
          { id: pokemonData.id },
          { $set: pokemonData },
          { upsert: true }
        );

        if (result.modifiedCount === 0) {
          console.info(`No changes were made to Pokemon with ID: ${id}.`);
          return null; 
        }

        return pokemonData;
      } catch (err) {
        console.error(`Error saving Pokemon ID ${id}: ${err.message}`);
        return null;
      }
    };

    const batchSize = 20; 
    const totalIds = 100;
    for (let i = 0; i < totalIds; i += batchSize) {
      const batchPromises = [];
      for (let j = i + 1; j <= Math.min(i + batchSize, totalIds); j++) {
        batchPromises.push(savePokemon(j));
      }
      await Promise.all(batchPromises);
    }

    return h
      .response({
        message: `Fetched and saved Pokemon data for IDs 1 to 100.`,
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
