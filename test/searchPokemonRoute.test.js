const { expect } = require('chai');
const searchPokemon = require('../handlers/searchPokemonRoute');
const PokemonData = require('../models/pokemons');

describe('searchPokemon Handler', () => {

  let originalFind;
  beforeEach(() => {
    originalFind = PokemonData.find;
    PokemonData.find = async () => [];
  });

  afterEach(() => {
    PokemonData.find = originalFind;
  });

  it('should return 405 if method is incorrect', async () => {

    const req = { method: 'GET' };
    const h = {
      response: (body) => ({
        code: (statusCode) => ({ ...body, statusCode })
      })
    };

    const response = await searchPokemon.handler(req, h);
    expect(response.statusCode).to.equal(405);
    expect(response.status).to.equal('ERROR');
    expect(response.description).to.equal('Method not found');
  });

  it('should return 400 if validation fails (empty search)', async () => {

    const req = { method: 'post', payload: { search: '' } };
    const h = {
      response: (body) => ({
        code: (statusCode) => ({ ...body, statusCode })
      })
    };

    const response = await searchPokemon.handler(req, h);

    expect(response.statusCode).to.equal(400);
    expect(response.status).to.equal('ERROR');
    expect(response.description).to.equal('No search infomation provided');
  });

  it('should return 400 if validation fails (search too long)', async () => {

    const req = { method: 'post', payload: { search: 'VeryLongSearchQuery' } };
    const h = {
      response: (body) => ({
        code: (statusCode) => ({ ...body, statusCode })
      })
    };

    const response = await searchPokemon.handler(req, h);

    expect(response.statusCode).to.equal(400);
    expect(response.status).to.equal('ERROR');
    expect(response.description).to.equal('Search query is too long');
  });

  it('should return 404 if no Pokémon found', async () => {

    PokemonData.find = async () => [];

    const req = { method: 'post', payload: { search: 'pikachu' } };
    const h = {
      response: (body) => ({
        code: (statusCode) => ({ ...body, statusCode })
      })
    };

    const response = await searchPokemon.handler(req, h);

    expect(response.statusCode).to.equal(404);
    expect(response.status).to.equal('SUCCES');
    expect(response.description).to.equal('Pokemon not found');
  });

  it('should return 200 and results if Pokémon found', async () => {

    const mockPokemon = [{
      id: 1,
      name: 'pikachu',
      types: ['electric'],
      abilities: ['static'],
      weight: 6,
      height: 0.4,
      image: 'pikachu.png'
    }];
    PokemonData.find = async () => mockPokemon;

    const req = { method: 'post', payload: { search: 'pikachu' } };
    const h = {
      response: (body) => ({
        code: (statusCode) => ({ ...body, statusCode })
      })
    };

    const response = await searchPokemon.handler(req, h);

    expect(response.statusCode).to.equal(200);
    expect(response.status).to.equal('SUCCES');
    expect(response.description).to.equal('Pokemon  found.');
    expect(response.results).to.be.an('array');
    expect(response.results[0].name).to.equal('pikachu');
  });

  it('should return 500 if there is a database error', async () => {

    PokemonData.find = async () => {
      throw new Error('Database error');
    };

    const req = { method: 'post', payload: { search: 'pikachu' } };
    const h = {
      response: (body) => ({
        code: (statusCode) => ({ ...body, statusCode })
      })
    };

    const response = await searchPokemon.handler(req, h);

    expect(response.statusCode).to.equal(500);
    expect(response.message).to.equal('Error while processing the request');
    expect(response.error).to.equal('Database error');
  });
});
