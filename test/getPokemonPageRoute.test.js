const { expect } = require('chai');
const pagePokemonsHandler = require('../handlers/getPokemonPageRoute');
const PokemonData = require('../models/pokemons');

describe('pagePokemons Handler', () => {

    beforeEach(() => {
        PokemonData.find = async () => [];
    });

    it('should return 400 if page is not provided', async () => {
        const req = { query: {} };
        const h = {
            response: (body) => ({
                code: (statusCode) => ({ ...body, statusCode })
            })
        };

        const response = await pagePokemonsHandler.handler(req, h);

        expect(response.statusCode).to.equal(400);
        expect(response.message).to.equal('Validation error');
        expect(response.details[0]).to.equal('Page is required!');
    });

    it('should return 400 if page is not a positive integer', async () => {
        const req = { query: { page: 'abc' } };
        const h = {
            response: (body) => ({
                code: (statusCode) => ({ ...body, statusCode })
            })
        };

        const response = await pagePokemonsHandler.handler(req, h);

        expect(response.statusCode).to.equal(400);
        expect(response.message).to.equal('Validation error');
        expect(response.details[0]).to.equal('Page must be a valid number!');
    });

    it('should return 200 if Pokémon are found for the page', async () => {
        const mockPokemons = [
            { id: 1, name: 'Bulbasaur', types: ['grass', 'poison'] },
            { id: 2, name: 'Ivysaur', types: ['grass', 'poison'] },

        ];

        PokemonData.find = async () => mockPokemons;

        const req = { query: { page: 1 } };
        const h = {
            response: (body) => ({
                code: (statusCode) => ({ ...body, statusCode })
            })
        };

        const response = await pagePokemonsHandler.handler(req, h);

        expect(response.statusCode).to.equal(200);
        expect(response.message).to.equal('Pokemons found!');
        expect(response.data).to.have.lengthOf(2);
        expect(response.data[0].name).to.equal('Bulbasaur');
        expect(response.data[1].name).to.equal('Ivysaur');
    });

    it('should return 404 if no Pokémon found for the page', async () => {

        PokemonData.find = async () => [];

        const req = { query: { page: 999 } };
        const h = {
            response: (body) => ({
                code: (statusCode) => ({ ...body, statusCode })
            })
        };

        const response = await pagePokemonsHandler.handler(req, h);

        expect(response.statusCode).to.equal(404);
        expect(response.error).to.equal('Choose a valid page!');
    });

    it('should return 500 if there is a database error', async () => {

        PokemonData.find = async () => {
            throw new Error('Database error');
        };

        const req = { query: { page: 1 } };
        const h = {
            response: (body) => ({
                code: (statusCode) => ({ ...body, statusCode })
            })
        };

        const response = await pagePokemonsHandler.handler(req, h);

        expect(response.statusCode).to.equal(500);
        expect(response.message).to.equal('Error while processing the request.');
        expect(response.error).to.equal('Database error');
    });
});
