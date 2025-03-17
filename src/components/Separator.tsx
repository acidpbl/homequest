import { twMerge } from "tailwind-merge";
import Divider from "./Divider";
import type { ReactNode } from "react";

interface SeparatorProps {
  styling: string;
  placeholder: string | ReactNode;
}

export default function Separator(props: SeparatorProps) {
  return (
    <div
      className={twMerge(
        "flex gap-4 items-center justify-center",
        props.styling
      )}
    >
      <Divider float="horizontal" />
      <span className="text-sm text-nowrap text-violet-400">{props.placeholder}</span>
      <Divider float="horizontal" />
    </div>
  );
}
