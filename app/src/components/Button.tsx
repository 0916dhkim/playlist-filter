import * as classes from "./Button.css";

import { ButtonHTMLAttributes } from "react";
import classNames from "classnames";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  variant?: keyof typeof classes.variant;
};

export default function Button(props: ButtonProps) {
  return (
    <button
      {...props}
      className={classNames(
        props.className,
        classes.variant[props.variant ?? "default"]
      )}
    />
  );
}
