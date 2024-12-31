const fs = require("fs");
const Hapi = require('@hapi/hapi');
const getPokemon = require("./getAllPokemonsRoute");
const saveAllPokemons = require("./getAllRoute");  
const deleteAllPokemons = require("./deleteAllPokemonsRoute");  
const deletePokemonById = require("./deletePokemonbyIdRoute");  
const editPokemon = require("./editPokemonRoute"); 
const addPokemon = require("./addPokemonRoute");  



const routes = [
    {
      method: 'GET',
      path: '/getPokemon',
      handler: getPokemon.handler,
    },{
        method: 'GET',
        path: '/getAllPokemons',
        handler: saveAllPokemons.handler,
      },{
        method: 'DELETE',
        path: '/deleteAllPokemons',
        handler: deleteAllPokemons.handler,
      },{
        method: 'DELETE',
        path: '/deleteSpecificPokemon',
        handler: deletePokemonById.handler,
      },{
        method: 'PUT',
        path: '/editPokemon',
        handler: editPokemon.handler,
      },{
        method: 'POST',
        path: '/addPokemon',
        handler: addPokemon.handler,
      }]
module.exports = routes;