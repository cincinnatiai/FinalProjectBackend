const PokemonData = require('../models/pokemons');
const Joi = require('joi')

const searchPokemon = {
    method: 'POST',
    handler: async function (request, h) {
        const requestMethod = request.method.toLowerCase()
        if (request.method !== requestMethod) {
            return h.response({ status: "ERROR", description: "Method not found" }).code(405)
        }

        const schema = Joi.object({
            search: Joi.string()
                .min(1)
                .max(10)
                .messages({
                    'string.empty': 'No search infomation provided',
                    'string.max': 'Search query is too long',
                })
        })

        const { error } = schema.validate(request.payload)
        if (error != null) {
            return h.response({ status: "ERROR", description: error.details[0].message }).code(400);
        }

        const search = request.payload.search
        try {
            const searchInformation = search.toLowerCase();
            const regex = new RegExp(searchInformation, 'i');
            const filteredPokemonResult = await PokemonData.find({
                $or: [
                    { id: { $regex: regex } },
                    { name: { $regex: regex } },
                    { types: { $regex: regex } },
                ]
            });
            if (filteredPokemonResult.length === 0) {
                return h.response({ status: "SUCCES", description: 'Pokemon not found' }).code(404)
            } else {
                return h.response({ status: "SUCCES", description: 'Pokemon  found.', results: filteredPokemonResult }).code(200)
            }
        } catch (error) {
            return h.response({ message: 'Error while processing the request', error: error.message }).code(500);
        }
    },
};
module.exports = searchPokemon;
