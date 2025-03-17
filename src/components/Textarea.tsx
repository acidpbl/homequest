import type { TextareaHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  styling?: string;
}

export default function Textarea(props: TextareaProps) {
  return (
    <textarea
      className={twMerge(
        "p-2 rounded border border-violet-400 bg-violet-100 placeholder-violet-600 placeholder:opacity-50 outline-amber-500",
        props.styling
      )}
      {...props}
    />
  );
}
