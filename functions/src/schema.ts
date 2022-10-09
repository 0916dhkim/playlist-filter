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
