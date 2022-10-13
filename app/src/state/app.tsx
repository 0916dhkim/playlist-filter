import { FormMolecule } from "./formState";
import { atom } from "jotai";

type AppState =
  | {
      selectedPlaylistId: null;
    }
  | {
      selectedPlaylistId: string;
      formMolecule: FormMolecule;
    };

const baseAtom = atom<AppState>({
  selectedPlaylistId: null,
});

export const appAtom = atom((get) => get(baseAtom));
export const selectPlaylistAtom = atom(null, (get, set, playlistId: string) => {
  set(baseAtom, {
    selectedPlaylistId: playlistId,
    formMolecule: FormMolecule(),
  });
});
