import { Atom, PrimitiveAtom, atom } from "jotai";

export type RangeInputMolecule = {
  name: string;
  minInputAtom: PrimitiveAtom<number>;
  maxInputAtom: PrimitiveAtom<number>;
  min: number;
  max: number;
  errorAtom: Atom<string | undefined>;
};

export function RangeInputMolecule(
  name: string,
  min: number,
  max: number
): RangeInputMolecule {
  const roundedMin = Math.floor(min);
  const roundedMax = Math.ceil(max);
  const minInputAtom = atom(roundedMin);
  const maxInputAtom = atom(roundedMax);
  const errorAtom = atom((get) => {
    const parsedMin = Number(get(minInputAtom));
    if (isNaN(parsedMin)) {
      return "Invalid lower bound.";
    }
    const parsedMax = Number(get(maxInputAtom));
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
    minInputAtom,
    maxInputAtom,
    min: roundedMin,
    max: roundedMax,
    errorAtom,
  };
}
