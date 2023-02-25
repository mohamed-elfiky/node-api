import { getPokemonByName, getPokemons } from "./pokemon.handlers";
import { $ref } from "./pokemon.schema";

export default function PokemonRoutes(fastify, opts, next) {
  fastify.get(
    "/poke/:name",
    {
      schema: {
        params: $ref("getPokemonByNameRequestSchema"),
        response: {
          200: $ref("getPokemonByNameResponseSchema"),
        },
      },
    },
    getPokemonByName
  );

  fastify.get("/poke", getPokemons);

  next();
}
