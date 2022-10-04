import { Atom, WritableAtom, atom } from "jotai";
import { AudioFeatureRanges, PlaylistFilter } from "../api/types";
import { FormState, makeFormAtoms } from "./formState";

type AppState =
  | {
      selectedPlaylistId: null;
    }
  | {
      selectedPlaylistId: string;
      formAtom: Atom<FormState>;
      initializeFormAtom: WritableAtom<null, AudioFeatureRanges, void>;
      finishEditingAtom: WritableAtom<null, unknown, void>;
      exportVariablesAtom: Atom<{
        playlistName: string;
        filter: PlaylistFilter;
      } | null>;
    };

const baseAtom = atom<AppState>({
  selectedPlaylistId: null,
});

export const appAtom = atom((get) => get(baseAtom));
export const selectPlaylistAtom = atom(null, (get, set, playlistId: string) => {
  set(baseAtom, {
    selectedPlaylistId: playlistId,
    ...makeFormAtoms(),
  });
});
