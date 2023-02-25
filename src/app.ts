import fastify, {
  FastifyServerOptions,
  FastifyLoggerInstance,
  FastifyInstance,
} from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import PokemonRoutes from "./pokemon/pokemon.route";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifySwagger from "@fastify/swagger";
import { withRefResolver } from "fastify-zod";
import { version } from "../package.json";
import { pokemonSchemas } from "./pokemon/pokemon.schema";
const serverOptions: FastifyServerOptions<Server, FastifyLoggerInstance> = {
  logger: !!(process.env.NODE_ENV !== "development"),
};

const app: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify(
  serverOptions
);

app.register(
  fastifySwagger,
  withRefResolver({
    routePrefix: "/docs",
    exposeRoute: true,
    staticCSP: true,
    openapi: {
      info: {
        title: "Pokemon Proxy API",
        description: "API for POKEMONS",
        version,
      },
    },
  })
);

for (const schema of [...pokemonSchemas]) {
  app.addSchema(schema);
}

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
  uiHooks: {
    onRequest: function (request, reply, next) {
      next();
    },
    preHandler: function (request, reply, next) {
      next();
    },
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => {
    return swaggerObject;
  },
  transformSpecificationClone: true,
});

app.register(PokemonRoutes);

export default app;
