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
  const convertedMin = name == "durationMs" ? Math.floor(min/1000) : Math.floor(min)
  const convertedMax = name == "durationMs" ? Math.ceil(max/1000) : Math.ceil(max)
  const renamed = name == "durationMs" ? "duration (seconds)" : name
  const minAtom = atom(convertedMin);
  const maxAtom = atom(convertedMax);
  const sliderMinAtom = atom(convertedMin);
  const sliderMaxAtom = atom(convertedMax);
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
    name:renamed,
    minAtom,
    maxAtom,
    sliderMinAtom,
    sliderMaxAtom,
    errorAtom,
  };
}
