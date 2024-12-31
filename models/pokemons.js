const mongoose = require("mongoose");

const PokemonData = new mongoose.Schema({
    id: {
        type: Number,
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

module.exports = mongoose.model("Pokemon", PokemonData);
