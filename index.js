const Hapi = require('@hapi/hapi');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const routes = require('./handlers/router');
const Joi = require('joi')

dotenv.config();

const server = new Hapi.Server({
    port: 3000,
    host: 'localhost',
});

const init = async () => {
    try {
        await connectDB();
        server.route(routes);
        await server.start();
        console.log('Server running on:', server.info.uri);
    } catch (err) {
        console.error('Error starting the server:', err);
        process.exit(1);
    }
}; 
connectDB();


process.on('SIGINT', async () => {
    console.log('Stopping server...');
    await server.stop({ timeout: 10000 });
    console.log('Server stopped.');
    process.exit(0);
});

init();
