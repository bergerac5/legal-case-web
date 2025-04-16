import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export default function Button({ label, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        "",
        className
      )}
    >
      {label}
    </button>
  );
}
