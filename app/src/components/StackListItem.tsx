import * as classes from "./StackListItem.css";

import { ReactNode } from "react";
import { sprinkles } from "../sprinkles.css";

type StackListItemProps = {
  icon?: ReactNode;
  children: ReactNode;
};

export default function StackListItem({ icon, children }: StackListItemProps) {
  return (
    <li className={classes.item}>
      <div
        className={sprinkles({
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        })}
      >
        {icon}
      </div>
      {children}
    </li>
  );
}
