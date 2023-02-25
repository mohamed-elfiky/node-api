import fastify, { FastifyRequest, FastifyReply } from "fastify";
import { GetPokemonByName } from "./pokemon.schema";
import {
  constructRequestPath,
  computeResponse,
  BASE_URL,
} from "./pokemon.service";
import errors from "http-errors";
import { httpRequest, Method } from "../utils/httpRequest.util";

export async function getPokemonByName(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const name = request.params["name"];
  const path = constructRequestPath(name);

  let body: GetPokemonByName;

  try {
    body = (
      await httpRequest<GetPokemonByName>(Method.GET, `${BASE_URL}${path}`)
    ).body;
  } catch (err) {
    throw new errors.NotFound("no pokemon with that name found");
  }

  const result = await computeResponse(body, reply);

  return result;
}

export async function getPokemons(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const path = constructRequestPath("");
  const { body } = await httpRequest<any>(Method.GET, `${BASE_URL}${path}`);

  return body;
}
