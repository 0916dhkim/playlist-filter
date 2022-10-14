import { Atom, PrimitiveAtom, WritableAtom, atom } from "jotai";
import { getPlaylists, queryKey } from "../api/queries";

import { AudioFeatureRanges } from "../api/types";
import { AudioFeatureRangesMolecule } from "./audioFeatureRanges";
import { exportPlaylist } from "../api/mutations";
import { queryClient } from "../queryClient";

export type FormState =
  | {
      stage: "uninitialized";
    }
  | {
      stage: "editing";
      audioFeatureRanges: AudioFeatureRangesMolecule;
    }
  | {
      stage: "exporting";
      audioFeatureRanges: AudioFeatureRangesMolecule;
      playlistName: PrimitiveAtom<string>;
    };

export type FormMolecule = {
  formAtom: Atom<FormState>;
  initializeFormAtom: WritableAtom<null, AudioFeatureRanges, void>;
  canFinishEditingAtom: Atom<boolean>;
  finishEditingAtom: WritableAtom<null, unknown, void>;
  exportPlaylistAtom: WritableAtom<null, string, void>;
};

export function FormMolecule() {
  const baseAtom = atom<FormState>({ stage: "uninitialized" });
  const canFinishEditingAtom = atom((get) => {
    const prev = get(baseAtom);
    if (prev.stage !== "editing") {
      return false;
    }
    return !get(prev.audioFeatureRanges.hasErrorAtom);
  });
  return {
    formAtom: atom((get) => get(baseAtom)),
    initializeFormAtom: atom(
      null,
      (get, set, audioFeatureRanges: AudioFeatureRanges) => {
        const prev = get(baseAtom);
        if (prev.stage === "uninitialized") {
          set(baseAtom, {
            stage: "editing",
            audioFeatureRanges: AudioFeatureRangesMolecule(audioFeatureRanges),
          });
        }
      }
    ),
    canFinishEditingAtom,
    finishEditingAtom: atom(null, (get, set) => {
      const prev = get(baseAtom);
      const canFinishEditing = get(canFinishEditingAtom);
      if (prev.stage === "editing" && canFinishEditing) {
        set(baseAtom, {
          stage: "exporting",
          audioFeatureRanges: prev.audioFeatureRanges,
          playlistName: atom(""),
        });
      }
    }),
    exportPlaylistAtom: atom(null, async (get, set, playlistId: string) => {
      const formState = get(baseAtom);
      if (formState.stage !== "exporting") {
        return;
      }
      const playlistName = get(formState.playlistName);
      const audioFeatureRanges = get(formState.audioFeatureRanges.valueAtom);
      await exportPlaylist({
        sourcePlaylistId: playlistId,
        playlistName,
        audioFeatureRanges,
      });
      queryClient.invalidateQueries(queryKey(getPlaylists()));
    }),
  };
}
