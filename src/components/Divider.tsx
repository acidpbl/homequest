import { twMerge } from "tailwind-merge";

interface DividerProps {
  float: "horizontal" | "vertical";
}

export default function Divider(props: DividerProps) {
  return (
    <div
      className={twMerge(
        "bg-violet-400",
        props.float === "horizontal" ? "h-px w-full" : "w-px h-full"
      )}
    />
  );
}
