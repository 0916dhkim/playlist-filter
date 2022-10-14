import { useAtomValue, useSetAtom } from "jotai";

import EditingStage from "./EditingStage";
import ExportingStage from "./ExportingStage";
import { FormMolecule } from "../../../state/formState";
import { ReactElement } from "react";

type EditorFormProps = {
  playlistId: string;
  formMolecule: FormMolecule;
};

export default function EditorForm({
  playlistId,
  formMolecule: {
    formAtom,
    canFinishEditingAtom,
    finishEditingAtom,
    exportPlaylistAtom,
  },
}: EditorFormProps): ReactElement | null {
  const state = useAtomValue(formAtom);
  const canFinishEditing = useAtomValue(canFinishEditingAtom);
  const finishEditing = useSetAtom(finishEditingAtom);

  if (state.stage === "editing") {
    return (
      <EditingStage
        playlistId={playlistId}
        audioFeatureRangesMolecule={state.audioFeatureRanges}
        canFinishEditing={canFinishEditing}
        finishEditing={finishEditing}
      />
    );
  }
  if (state.stage === "exporting") {
    return (
      <ExportingStage
        playlistId={playlistId}
        exportPlaylistAtom={exportPlaylistAtom}
        playlistNameAtom={state.playlistName}
      />
    );
  }
  return null;
}
