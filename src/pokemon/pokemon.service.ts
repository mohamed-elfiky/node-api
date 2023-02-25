import { FastifyReply } from "fastify";
import { httpRequest, Method } from "../utils/httpRequest.util";
import { Type } from "./models/Type";
import { GetPokemonByName } from "./pokemon.schema";

export const BASE_URL = "https://pokeapi.co/api/v2/pokemon";

export const computeResponse = async (
  response: GetPokemonByName,
  reply: FastifyReply
) => {
  let typeUrls = response.types
    .map((type) => type.type)
    .map((type) => {
      return type.url;
    });

  let pokemonTypes = (
    await Promise.allSettled(
      typeUrls.map((url) => {
        return httpRequest<any>(Method.GET, url);
      })
    )
  ).map((result) => {
    if (result.status === "fulfilled") {
      return result.value.body;
    }
  });

  let modifiedResponse = calculateStatsAverage(response, pokemonTypes);

  return modifiedResponse;
};

export function constructRequestPath(name: string | null): string {
  let path = "/";

  if (name.trim() !== "") {
    path += name;
  } else {
    path += "?offset=20&limit=20";
  }

  return path;
}

function calculateStatsAverage(response: GetPokemonByName, pokemonTypes: any) {
  const statsHash = new Map<string, number[]>();

  pokemonTypes.forEach((element) => {
    if (element?.stats) {
      element.stats.map((stat) => {
        let stats_array: number[] = statsHash.get(stat.name);
        if (stats_array) {
          stats_array.push(stat.base_stat);
          statsHash.set(`${stat.name}`, stats_array);
        }
      });
    }
  });

  response.stats.forEach((element) => {
    const stats: number[] =
      statsHash.get(element.stat.name.toUpperCase()) || [];
    const avg = stats.length ? stats.reduce((a, b) => a + b) / stats.length : 0;
    element.averageStat = avg;
  });

  const statsBaseArray = response.stats.map((stat) => stat.base_stat);

  response.averageStat =
    statsBaseArray.reduce((a, b) => a + b) / statsBaseArray.length;

  return response;
}
