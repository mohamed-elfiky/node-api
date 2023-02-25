import { z } from "zod";

import { buildJsonSchemas } from "fastify-zod";

const getPokemonByNameRequestSchema = z.object({
  name: z.string().trim().min(2),
});

const getPokemonByNameResponseSchema = z.object({
  name: z.string().optional(),
  height: z.number().optional(),
  base_experience: z.number().optional(),
  averageBaseExperience: z.number().optional(),
  id: z.number().optional(),
  sprite_img: z.string().optional(),
  species: z
    .object({
      url: z.string(),
      name: z.string(),
    })
    .optional(),
  url: z.string().optional(),
  stats: z
    .array(
      z.object({
        base_stat: z.number().optional(),
        effort: z.string().optional(),
        stat: z.object({
          name: z.string().optional(),
          url: z.string().optional(),
        }),
        averageStat: z.number().optional(),
      })
    )
    .optional(),
  averageStat: z.number().optional(),
  types: z
    .array(
      z.object({
        slot: z.string().optional(),
        type: z
          .object({
            url: z.string().optional(),
            name: z.string().optional(),
          })
          .optional(),
      })
    )
    .optional(),
});

export type GetPokemonByName = z.infer<typeof getPokemonByNameResponseSchema>;

export const { schemas: pokemonSchemas, $ref } = buildJsonSchemas({
  getPokemonByNameRequestSchema,
  getPokemonByNameResponseSchema,
});
