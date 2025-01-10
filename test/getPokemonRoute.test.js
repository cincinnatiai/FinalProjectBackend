const { expect } = require('chai');
const getPokemonHandler = require('../handlers/getPokemonRoute');
const PokemonData = require('../models/pokemons');

const mockFetch = (url) => {
    return {
        ok: true,
        json: async () => ({
            id: 1,
            name: 'pikachu',
            abilities: [{ ability: { name: 'static' } }],
            weight: 6,
            height: 0.4,
            types: [{ type: { name: 'electric' } }],
            sprites: { front_default: 'pikachu.png' },
        }),
        statusText: 'OK',
        status: 200,
    };
};

global.fetch = mockFetch;

describe('getPokemon Handler', () => {

    beforeEach(() => {
        PokemonData.findOne = async () => null;
        PokemonData.updateOne = async () => ({ upsertedCount: 1 });
    });

    it('should return 400 if Pokemon ID is not provided', async () => {

        const req = { query: {} };
        const h = {
            response: (body) => ({
                code: (statusCode) => ({ ...body, statusCode })
            })
        };

        const response = await getPokemonHandler.handler(req, h);

        expect(response.statusCode).to.equal(400);
        expect(response.message).to.equal('Validation error');
        expect(response.details[0]).to.equal('Pokémon ID is required!');
    });


    it('should return 400 if Pokemon ID is not a positive integer', async () => {

        const req = { query: { id: -1 } };
        const h = {
            response: (body) => ({
                code: (statusCode) => ({ ...body, statusCode })
            })
        };

        const response = await getPokemonHandler.handler(req, h);

        expect(response.statusCode).to.equal(400);
        expect(response.message).to.equal('Validation error');
        expect(response.details[0]).to.equal('Pokémon ID must be a positive integer!');
    });

    it('should return 200 if Pokémon is found in the database', async () => {

        const mockPokemon = {
            id: 1,
            name: 'pikachu',
            abilities: ['static'],
            weight: 6,
            height: 0.4,
            types: ['electric'],
            image: 'pikachu.png'
        };


        PokemonData.findOne = async () => mockPokemon;

        const req = { query: { id: 1 } };
        const h = {
            response: (body) => ({
                code: (statusCode) => ({ ...body, statusCode })
            })
        };

        const response = await getPokemonHandler.handler(req, h);

        expect(response.statusCode).to.equal(200);
        expect(response.message).to.equal('Fetched Pokémon pikachu from the database.');
        expect(response.data.name).to.equal('pikachu');
    });

    it('should return 200 and fetch from external API if Pokémon not found in database', async () => {

        PokemonData.findOne = async () => null;
        const req = { query: { id: 1 } };
        const h = {
            response: (body) => ({
                code: (statusCode) => ({ ...body, statusCode })
            })
        };

        const response = await getPokemonHandler.handler(req, h);

        expect(response.statusCode).to.equal(200);
        expect(response.message).to.equal('Fetched and saved Pokemon pikachu from the API.');
        expect(response.data.name).to.equal('pikachu');
    });

    it('should return 500 if there is an error while fetching from the external API', async () => {

        global.fetch = async () => {
            return { ok: false, statusText: 'Not Found', status: 404 };
        };
        const req = { query: { id: 999 } };
        const h = {
            response: (body) => ({
                code: (statusCode) => ({ ...body, statusCode })
            })
        };

        const response = await getPokemonHandler.handler(req, h);

        expect(response.statusCode).to.equal(404);
        expect(response.message).to.equal('Cannot fetch Pokemon with ID: 999');
        expect(response.error).to.equal('Not Found');
    });

    it('should return 500 if there is a database error', async () => {

        PokemonData.findOne = async () => {
            throw new Error('Database error');
        };

        const req = { query: { id: 1 } };
        const h = {
            response: (body) => ({
                code: (statusCode) => ({ ...body, statusCode })
            })
        };

        const response = await getPokemonHandler.handler(req, h);

        expect(response.statusCode).to.equal(500);
        expect(response.message).to.equal('Error while processing the request');
        expect(response.error).to.equal('Database error');
    });
});
