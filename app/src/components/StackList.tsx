import { ReactNode } from "react";
import { container } from "./StackList.css";

type StackListProps = {
  children: ReactNode;
};

export function StackList({ children }: StackListProps) {
  return <ul className={container}>{children}</ul>;
}
