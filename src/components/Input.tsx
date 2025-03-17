import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export default function Input(props: InputProps) {
  return (
    <input
      className="p-2 rounded border border-violet-400 bg-violet-100 placeholder:text-violet-600 placeholder:opacity-50 outline-amber-500"
      {...props}
    />
  );
}
