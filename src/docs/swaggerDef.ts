// @ts-ignore
import { version } from '../../package.json';

interface Server {
  url: string;
}

interface Info {
  title: string;
  version: string;
}

interface SwaggerDef {
  openapi: string;
  info: Info;
  servers: Server[];
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http';
        scheme: 'bearer';
        bearerFormat: 'JWT';
      };
    };
  };
  security: {
    bearerAuth: string[];
  }[];
}

const swaggerDef: SwaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Job-Mint List Web Application v1 Documentation',
    version,
  },
  servers: [
    {
      url: `http://localhost:3000/v1`,
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

export default swaggerDef;
