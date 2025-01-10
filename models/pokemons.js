const mongoose = require('mongoose');

const PokemonSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
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

PokemonSchema.set('toJSON', {
  virtuals: true,
  versionKey: false, 
  transform: (doc, ret) => {
    delete ret._id; 
    return ret;
  },
});

const Pokemon = mongoose.model('Pokemon', PokemonSchema);
module.exports = Pokemon;
