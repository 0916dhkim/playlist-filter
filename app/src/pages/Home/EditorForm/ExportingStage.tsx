import { PrimitiveAtom, useSetAtom } from "jotai";

import { FormEventHandler } from "react";
import { FormMolecule } from "../../../state/formState";
import PlaylistNameInput from "./PlaylistNameInput";

type ExportingStageProps = {
  playlistId: string;
  exportPlaylistAtom: FormMolecule["exportPlaylistAtom"];
  playlistNameAtom: PrimitiveAtom<string>;
};

export default function ExportingStage({
  playlistId,
  exportPlaylistAtom,
  playlistNameAtom,
}: ExportingStageProps) {
  const exportPlaylist = useSetAtom(exportPlaylistAtom);

  const handleExportSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    exportPlaylist(playlistId);
  };

  return (
    <form onSubmit={handleExportSubmit}>
      <h1>New Playlist Name</h1>
      <PlaylistNameInput valueAtom={playlistNameAtom} />
      <button>Export</button>
    </form>
  );
}
