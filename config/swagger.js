const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'BTL DBMS',
            version: '1.0.0',
            description: 'This is a sample API to demonstrate Swagger integration with Express.'
        },
    },
    apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };