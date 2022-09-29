import { PrimitiveAtom, useAtom } from "jotai";

import { ReactElement } from "react";

type PlaylistNameInputProps = {
  valueAtom: PrimitiveAtom<string>;
};

export default function PlaylistNameInput({
  valueAtom,
}: PlaylistNameInputProps): ReactElement {
  const [value, setValue] = useAtom(valueAtom);
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}
