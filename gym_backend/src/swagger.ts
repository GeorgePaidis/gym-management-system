import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import mongooseToSwagger from "mongoose-to-swagger";
import { Express } from 'express';
import User from './models/user.model';
import Schedule from './models/schedule.model';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gym API",
      version: "1.0.0",
      description: "API for Project Gym"
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Local Server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      "schemas": {
        User: mongooseToSwagger(User),
        Schedule: mongooseToSwagger(Schedule)
      }
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts']
};

export const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}