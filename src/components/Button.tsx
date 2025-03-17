import type { ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  placeholder: string | ReactNode;
  variant: "primary" | "secondary" | "danger";
  styling?: string;
  click?: () => void;
}

export default function Button(props: ButtonProps) {
  const variants = {
    primary:
      "bg-violet-600 text-violet-200 hover:bg-violet-800 hover:text-violet-300",
    secondary:
      "bg-violet-300 text-violet-600 hover:bg-violet-400 hover:text-violet-700",
    danger: "bg-red-500 text-red-200 hover:bg-red-700 hover:text-red-300",
  };
  return (
    <button
      className={twMerge(
        "p-2 rounded ease-linear transition-colors flex gap-4 items-center outline-amber-500",
        variants[props.variant],
        props.disabled ? "cursor-not-allowed" : "cursor-pointer",
        props.styling
      )}
      onClick={props.click}
    >
      {props.placeholder}
    </button>
  );
}
