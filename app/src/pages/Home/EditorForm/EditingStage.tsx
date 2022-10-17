import { ALL_AUDIO_FEATURES } from "../../../api/types";
import AudioFeatureRangeInput from "./AudioFeatureRangeInput";
import { AudioFeatureRangesMolecule } from "../../../state/audioFeatureRanges";
import { FormEventHandler } from "react";
import Tracks from "./Tracks";
import { isDefined } from "../../../typeHelpers";
import { useAtomValue } from "jotai";

type EditingStageProps = {
  playlistId: string;
  canFinishEditing: boolean;
  finishEditing: () => void;
  audioFeatureRangesMolecule: AudioFeatureRangesMolecule;
};

export default function EditingStage({
  playlistId,
  canFinishEditing,
  finishEditing,
  audioFeatureRangesMolecule,
}: EditingStageProps) {
  const hasError = useAtomValue(audioFeatureRangesMolecule.hasErrorAtom);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    finishEditing();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {ALL_AUDIO_FEATURES.map(
          (feature) => audioFeatureRangesMolecule[feature]
        )
          .filter(isDefined)
          .map((rangeInputMolecule) => (
            <AudioFeatureRangeInput
              key={rangeInputMolecule.name}
              molecule={rangeInputMolecule}
            />
          ))}
        <button disabled={!canFinishEditing}>Next</button>
      </form>
      {hasError ? null : (
        <Tracks
          playlistId={playlistId}
          audioFeatureRangesAtom={audioFeatureRangesMolecule.valueAtom}
        />
      )}
    </>
  );
}
