import {
  ALL_AUDIO_FEATURES,
  AudioFeatureRanges,
  PlaylistFilter,
} from "../../api/types";
import { Atom, WritableAtom, useAtomValue, useSetAtom } from "jotai";
import { FormEventHandler, ReactElement, useCallback } from "react";

import AudioFeatureRangeInput from "./AudioFeatureRangeInput";
import { FormState } from "../../state/formState";
import PlaylistNameInput from "./PlaylistNameInput";
import { getTracks } from "../../api/queries";
import invariant from "tiny-invariant";
import { isDefined } from "../../typeHelpers";
import { useAtomCallback } from "jotai/utils";
import { useExportPlaylistMutation } from "../../api/mutations";
import { useQuery } from "@tanstack/react-query";

type FilterFormProps = {
  playlistId: string;
  formAtom: Atom<FormState>;
  initializeFormAtom: WritableAtom<null, AudioFeatureRanges, void>;
  finishEditingAtom: WritableAtom<null, unknown, void>;
  exportVariablesAtom: Atom<{
    playlistName: string;
    filter: PlaylistFilter;
  } | null>;
};

export default function FilterForm({
  playlistId,
  formAtom,
  initializeFormAtom,
  finishEditingAtom,
  exportVariablesAtom,
}: FilterFormProps): ReactElement | null {
  const state = useAtomValue(formAtom);
  const initializeForm = useSetAtom(initializeFormAtom);
  const finishEditing = useSetAtom(finishEditingAtom);
  useQuery(...getTracks(playlistId), {
    onSuccess: ({ audioFeatureRanges }) => {
      initializeForm(audioFeatureRanges);
    },
  });
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
        {ALL_AUDIO_FEATURES.map((feature) => state.inputProps[feature])
          .filter(isDefined)
          .map((props) => (
            <AudioFeatureRangeInput key={props.feature} {...props} />
          ))}
        <button>Next</button>
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
