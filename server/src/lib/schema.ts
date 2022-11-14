import express from "express";
import { z } from "zod";

const tupleToLiterals = <TTuple extends any[]>(...tuple: TTuple) =>
  tuple.map((element) => z.literal(element)) as {
    [I in keyof TTuple]: z.ZodLiteral<TTuple[I]>;
  };

export const stringLiteralUnion = <
  TLiterals extends [string, string, ...string[]]
>(
  ...literals: TLiterals
) => z.union(tupleToLiterals(...literals));

/**
 * Parse URL query string in JSON format.
 * @param query query string (URI decoded)
 * @param schema zod schema for parsing. Can be nullish.
 * @returns parse result
 */
export function parseJsonQuery<T>(
  query: express.Request["query"][string],
  schema: z.ZodType<T>
): T {
  if (typeof query !== "string" && query !== undefined) {
    throw new Error("Cannot parse a non-string query.");
  }
  return schema.parse(query ? JSON.parse(query) : undefined);
}
