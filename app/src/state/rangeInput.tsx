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
  max: number,
): RangeInputMolecule {
  const convertedMin = name == "durationMs" ? Math.floor(min/1000) : Math.floor(min)
  const convertedMax = name == "durationMs" ? Math.ceil(max/1000) : Math.ceil(max)
  const renamed = name == "durationMs" ? "duration (seconds)" : name
  const minInputAtom = atom(convertedMin);
  const maxInputAtom = atom(convertedMax);
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
    name:renamed,
    minInputAtom,
    maxInputAtom,
    min:convertedMin,
    max:convertedMax,
    errorAtom,
  };
}
