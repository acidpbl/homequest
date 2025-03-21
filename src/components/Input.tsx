import type { InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  styling?: string;
}

export default function Input(props: InputProps) {
  return (
    <input
      className={twMerge(
        "p-2 rounded border border-violet-400 bg-violet-100 placeholder-violet-600 placeholder:opacity-50 outline-amber-500",
        props.styling
      )}
      {...props}
    />
  );
}
