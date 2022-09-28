import {
  ALL_AUDIO_FEATURES,
  AudioFeature,
  AudioFeatureRanges,
  PlaylistFilter,
} from "../../api/types";
import {
  ComponentPropsWithoutRef,
  FormEventHandler,
  ReactElement,
  useState,
} from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import AudioFeatureRangeInput from "./AudioFeatureRangeInput";
import { getTracks } from "../../api/queries";
import { isDefined } from "../../typeHelpers";
import { useExportPlaylistMutation } from "../../api/mutations";

type InputProps = {
  [k in AudioFeature]?: ComponentPropsWithoutRef<typeof AudioFeatureRangeInput>;
};

type FilterFormState =
  | {
      initialized: false;
    }
  | {
      initialized: true;
      stage: "editing";
      inputProps: InputProps;
    }
  | {
      initialized: true;
      stage: "exporting";
      inputProps: InputProps;
      playlistName: string;
    };

type FilterFormProps = {
  playlistId: string;
};

function initialInputProps(audioFeatureRanges: AudioFeatureRanges) {
  const inputProps: InputProps = {};
  for (const feature of ALL_AUDIO_FEATURES) {
    const range = audioFeatureRanges[feature];
    if (range) {
      inputProps[feature] = {
        feature,
        desiredMin: range.min.toString(),
        desiredMax: range.max.toString(),
      };
    }
  }
  return inputProps;
}

export default function FilterForm({
  playlistId,
}: FilterFormProps): ReactElement | null {
  const [state, setState] = useState<FilterFormState>({ initialized: false });
  useQuery(...getTracks(playlistId), {
    onSuccess: ({ audioFeatureRanges }) => {
      setState((prev) =>
        prev.initialized
          ? prev
          : {
              initialized: true,
              stage: "editing",
              inputProps: initialInputProps(audioFeatureRanges),
            }
      );
    },
  });
  const exportMutation = useExportPlaylistMutation();

  const handleChange =
    (feature: AudioFeature) => (value: string, type: "min" | "max") => {
      setState((prev) => {
        if (!prev.initialized || prev.stage !== "editing") return prev;
        const updateKey = type === "min" ? "desiredMin" : "desiredMax";
        return {
          ...prev,
          inputProps: {
            ...prev.inputProps,
            [feature]: {
              ...prev.inputProps[feature],
              [updateKey]: value,
            },
          },
        };
      });
    };

  const handlePlaylistNameChange = (value: string) => {
    setState((prev) => {
      if (!prev.initialized || prev.stage !== "exporting") return prev;
      return {
        ...prev,
        playlistName: value,
      };
    });
  };

  const handleEditingSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    setState((prev) => {
      if (!prev.initialized || prev.stage !== "editing") return prev;
      return {
        ...prev,
        stage: "exporting",
        playlistName: "",
      };
    });
  };

  const handleExportSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    if (!state.initialized || state.stage !== "exporting") return;
    const filter: PlaylistFilter = {};
    for (const feature of ALL_AUDIO_FEATURES) {
      const featureInput = state.inputProps[feature];
      if (featureInput) {
        filter[feature] = {
          min: Number(featureInput.desiredMin),
          max: Number(featureInput.desiredMax),
        };
      }
    }
    exportMutation.mutate({
      sourcePlaylistId: playlistId,
      playlistName: state.playlistName,
      filter,
    });
  };

  return state.initialized ? (
    state.stage === "editing" ? (
      <form onSubmit={handleEditingSubmit}>
        {ALL_AUDIO_FEATURES.map((feature) => state.inputProps[feature])
          .filter(isDefined)
          .map((props) => (
            <AudioFeatureRangeInput
              key={props.feature}
              {...props}
              onChange={handleChange(props.feature)}
            />
          ))}
        <button>Next</button>
      </form>
    ) : (
      <form onSubmit={handleExportSubmit}>
        <h1>New Playlist Name</h1>
        <input
          value={state.playlistName}
          onChange={(e) => handlePlaylistNameChange(e.target.value)}
        />
        <button>Export</button>
      </form>
    )
  ) : null;
}
