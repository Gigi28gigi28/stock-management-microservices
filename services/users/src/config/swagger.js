import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "AI Dashboard API",
            version: "1.0.0",
            description: "API documentation for the AI Dashboard backend"
        },
        servers: [
            { url: `http://localhost:${process.env.PORT || 5001}` }
        ]
    },
    apis: ["./routes/*.js", "./models/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerServe = swaggerUi.serve;
export const swaggerSetup = swaggerUi.setup(swaggerSpec);
