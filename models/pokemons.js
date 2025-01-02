const mongoose = require("mongoose");

const PokemonData = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true, 
    },
    name: {
        type: String,
        required: true,
        unique: false,
    },
    abilities: {
        type: [String], 
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
    types: {
        type: [String], 
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
});
const Pokemons = mongoose.model('Pokemon', PokemonData)
module.exports = Pokemons
