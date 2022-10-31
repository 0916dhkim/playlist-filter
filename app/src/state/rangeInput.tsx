import { Atom, PrimitiveAtom, atom } from "jotai";

export type RangeInputMolecule = {
  name: string;
  minAtom: PrimitiveAtom<number>;
  maxAtom: PrimitiveAtom<number>;
  sliderMinAtom: PrimitiveAtom<number>;
  sliderMaxAtom: PrimitiveAtom<number>;
  errorAtom: Atom<string | undefined>;
};

export function RangeInputMolecule(
  name: string,
  min: number,
  max: number,
): RangeInputMolecule {
  const minAtom = atom(Math.floor(min));
  const maxAtom = atom(Math.ceil(max));
  const sliderMinAtom = atom(Math.floor(min));
  const sliderMaxAtom = atom(Math.ceil(max));
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
    sliderMinAtom,
    sliderMaxAtom,
    errorAtom,
  };
}
