import {
  Blocks as LucideBlocks,
  Stamp as LucideStamp,
  StickyNote as LucideStickyNote,
  User as LucideUser,
} from "lucide-react";
import { useState, useRef, useEffect, type SelectHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface Option {
  placeholder: string;
  value: string;
  icon?: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLDivElement> {
  options: Option[];
  change: (value: string) => void;
  styling?: string;
}

export default function Select(props: SelectProps) {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (value: string) => {
    setSelectedOption(value);
    props.change(value);
    setOpen(false);
  };

  return (
    <div className={twMerge("relative", props.styling)} ref={selectRef}>
      <div
        className="cursor-pointer p-2 rounded border border-violet-400 bg-violet-100 min-w-48"
        onClick={() => setOpen(!open)}
      >
        {selectedOption
          ? props.options.find((option) => option.value === selectedOption)
              ?.placeholder
          : "Selecione uma opção"}
      </div>

      {open && (
        <div className="absolute top-full left-0 w-full rounded bg-violet-100 border border-violet-400 z-10 overflow-y-auto min-h-48">
          {props.options.map((option, index) => (
            <div
              key={index}
              className={twMerge(
                "p-2 cursor-pointer hover:bg-violet-200 flex items-center gap-2",
                option.placeholder === "Pablo" && "bg-indigo-200",
                option.value === "limpeza" && "bg-teal-100",
                option.value === "contas" && "bg-amber-100",
                option.value === "geral" && "bg-violet-100"
              )}
              onClick={() => handleChange(option.value)}
            >
              {option.icon && option.icon.includes("https://") ? (
                <img
                  src={option.icon}
                  alt={option.placeholder}
                  className="w-5 h-5 inline-block rounded-full"
                />
              ) : option.value === "user-filled" ? (
                <LucideUser
                  fill="#2f0d68"
                  stroke="#2f0d68"
                  className="size-4 inline-block"
                />
              ) : option.value === "limpeza" ? (
                <LucideStamp
                  fill="#2f0d68"
                  stroke="#2f0d68"
                  className="size-4 inline-block"
                />
              ) : option.value === "contas" ? (
                <LucideStickyNote
                  fill="#2f0d68"
                  stroke="#2f0d68"
                  className="size-4 inline-block"
                />
              ) : option.value === "geral" ? (
                <LucideBlocks
                  fill="#2f0d68"
                  stroke="#2f0d68"
                  className="size-4 inline-block"
                />
              ) : (
                ""
              )}

              <span>{option.placeholder}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
