import { InputHTMLAttributes } from "react";
import classNames from "classnames";
import { variant } from "./TextInput.css";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  variant?: keyof typeof variant;
};
export default function TextInput(props: TextInputProps) {
  return (
    <input
      {...props}
      className={classNames(
        props.className,
        variant[props.variant ?? "default"]
      )}
    />
  );
}
