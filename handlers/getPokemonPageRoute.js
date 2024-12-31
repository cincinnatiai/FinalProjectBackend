const PokemonData = require('../models/pokemons');

const pagePokemons = {
    method: 'GET', 
    handler: async function (request, h){
        const {page} = request.query;

        try{
            const toPokemon = page *10;
            const fromPokemon = toPokemon - 9;

            const resultsPage = await PokemonData.find({ 
                id: { $gte: Number(fromPokemon), $lte: Number(toPokemon) } 
            });       
            if(resultsPage.length === 0){
                return h.response({
                    error: 'choose a valid page!', 
                }).code(404);
            }   
            return h.response({
                message:`pokemons found!`,
                data: resultsPage,
            }).code(200)
            
        }catch(error){
            return h.response({
                message:'Error while processing the request',
                error: error.message
            }).code(500);
        }
    }
}
module.exports = pagePokemons;