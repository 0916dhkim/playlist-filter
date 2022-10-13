import { FormMolecule } from "./formState";
import { atom } from "jotai";
import { getTracks } from "../api/queries";
import invariant from "tiny-invariant";
import { queryClient } from "../queryClient";

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
export const selectPlaylistAtom = atom(
  null,
  async (get, set, playlistId: string) => {
    set(baseAtom, {
      selectedPlaylistId: playlistId,
      formMolecule: FormMolecule(),
    });
    const { audioFeatureRanges } = await queryClient.fetchQuery(
      ...getTracks(playlistId)
    );
    const appStateAfterSelect = get(baseAtom);
    invariant(appStateAfterSelect.selectedPlaylistId != null);
    set(
      appStateAfterSelect.formMolecule.initializeFormAtom,
      audioFeatureRanges
    );
    // TODO: make this atom abortable.
  }
);
