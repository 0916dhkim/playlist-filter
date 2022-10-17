import { Atom, PrimitiveAtom, atom } from "jotai";

export type RangeInputMolecule = {
  name: string;
  minAtom: PrimitiveAtom<string>;
  maxAtom: PrimitiveAtom<string>;
  errorAtom: Atom<string | undefined>;
};

export function RangeInputMolecule(
  name: string,
  min: number,
  max: number
): RangeInputMolecule {
  const minAtom = atom(min.toString());
  const maxAtom = atom(max.toString());
  const errorAtom = atom((get) => {
    const parsedMin = Number(get(minAtom));
    if (isNaN(parsedMin)) {
      return "Invalid lower bound.";
    }
    const parsedMax = Number(get(maxAtom));
    if (isNaN(parsedMax)) {
      return "Invalid upper bound.";
    }
    if (parsedMin > parsedMax) {
      return "min should not be greater than max.";
    }
    return undefined;
  });
  return {
    name,
    minAtom,
    maxAtom,
    errorAtom,
  };
}
