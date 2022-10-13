import { FormEventHandler, ReactElement, useCallback } from "react";
import { useAtomValue, useSetAtom } from "jotai";

import { ALL_AUDIO_FEATURES } from "../../api/types";
import AudioFeatureRangeInput from "./AudioFeatureRangeInput";
import { FormMolecule } from "../../state/formState";
import PlaylistNameInput from "./PlaylistNameInput";
import invariant from "tiny-invariant";
import { isDefined } from "../../typeHelpers";
import { useAtomCallback } from "jotai/utils";
import { useExportPlaylistMutation } from "../../api/mutations";

type FilterFormProps = {
  playlistId: string;
  formMolecule: FormMolecule;
};

export default function FilterForm({
  playlistId,
  formMolecule: {
    formAtom,
    canFinishEditingAtom,
    finishEditingAtom,
    exportVariablesAtom,
  },
}: FilterFormProps): ReactElement | null {
  const state = useAtomValue(formAtom);
  const canFinishEditing = useAtomValue(canFinishEditingAtom);
  const finishEditing = useSetAtom(finishEditingAtom);
  const exportMutation = useExportPlaylistMutation();
  const exportPlaylist = useAtomCallback(
    useCallback(
      (get, set) => {
        const exportVariables = get(exportVariablesAtom);
        invariant(exportVariables);
        exportMutation.mutate({
          sourcePlaylistId: playlistId,
          ...exportVariables,
        });
      },
      [playlistId, exportMutation]
    )
  );

  const handleEditingSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    finishEditing();
  };

  const handleExportSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    exportPlaylist();
  };

  if (state.stage === "editing") {
    return (
      <form onSubmit={handleEditingSubmit}>
        {ALL_AUDIO_FEATURES.map((feature) => state.audioFeatureRanges[feature])
          .filter(isDefined)
          .map((rangeInputMolecule) => (
            <AudioFeatureRangeInput
              key={rangeInputMolecule.name}
              molecule={rangeInputMolecule}
            />
          ))}
        <button disabled={!canFinishEditing}>Next</button>
      </form>
    );
  }
  if (state.stage === "exporting") {
    return (
      <form onSubmit={handleExportSubmit}>
        <h1>New Playlist Name</h1>
        <PlaylistNameInput valueAtom={state.playlistName} />
        <button>Export</button>
      </form>
    );
  }
  return null;
}
