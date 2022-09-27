import {
  ALL_AUDIO_FEATURES,
  AudioFeature,
  AudioFeatureRanges,
} from "../../api/types";
import {
  ComponentPropsWithoutRef,
  FormEventHandler,
  ReactElement,
  useState,
} from "react";

import AudioFeatureRangeInput from "./AudioFeatureRangeInput";
import { getTracks } from "../../api/queries";
import { isDefined } from "../../typeHelpers";
import { useQuery } from "@tanstack/react-query";

type InputProps = {
  [k in AudioFeature]?: ComponentPropsWithoutRef<typeof AudioFeatureRangeInput>;
};

type FilterFormState =
  | {
      initialized: false;
    }
  | {
      initialized: true;
      stage: "editing" | "exporting";
      inputProps: InputProps;
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

  const handleChange =
    (feature: AudioFeature) => (value: string, type: "min" | "max") => {
      setState((prev) => {
        if (!prev.initialized) return prev;
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

  const handleEditingSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    setState((prev) => {
      if (!prev.initialized || prev.stage !== "editing") return prev;
      return {
        ...prev,
        stage: "exporting",
      };
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
        <button>Export</button>
      </form>
    ) : (
      <p>Exporting</p>
    )
  ) : null;
}
