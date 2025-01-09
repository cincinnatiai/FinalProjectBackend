const getPokemon = require("./getPokemonRoute");
const searchPokemon = require("./searchPokemonRoute")
const saveAllPokemons = require("./getAllRoute");
const deleteAllPokemons = require("./deleteAllPokemonsRoute");
const deletePokemonById = require("./deletePokemonbyIdRoute");
const editPokemon = require("./editPokemonRoute");
const addPokemon = require("./addPokemonRoute");
const pagePokemons = require("./getPokemonPageRoute");


const routes = [
  {
    method: 'GET',
    path: '/getPokemon',
    handler: getPokemon.handler,
  },{
    method: 'POST',
    path: '/searchPokemon',
    handler: searchPokemon.handler,
  },{
    method: 'GET',
    path: '/getAllPokemons',
    handler: saveAllPokemons.handler,
  }, {
    method: 'DELETE',
    path: '/deleteAllPokemons',
    handler: deleteAllPokemons.handler,
  }, {
    method: 'DELETE',
    path: '/deleteSpecificPokemon',
    handler: deletePokemonById.handler,
  }, {
    method: 'PUT',
    path: '/editPokemon',
    handler: editPokemon.handler,
  }, {
    method: 'POST',
    path: '/addPokemon',
    handler: addPokemon.handler,
  }, {
    method: 'GET',
    path: '/getPokemonPage',
    handler: pagePokemons.handler,
  }];

module.exports = routes;