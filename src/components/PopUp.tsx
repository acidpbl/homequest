import { X as LucideX } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import Button from "./Button";
import { AnimatePresence, motion } from "framer-motion";

interface PopUpProps {
  title?: string;
  description?: string;
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export default function PopUp(props: PopUpProps) {
  const popUpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!props.isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popUpRef.current &&
        !popUpRef.current.contains(event.target as Node)
      ) {
        props.onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [props.isOpen, props.onClose]);

  if (!props.isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex flex-col justify-center items-center bg-violet-800/20 backdrop-blur-[2px] z-50"
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div
          ref={popUpRef}
          className="bg-violet-100 p-6 rounded flex flex-col gap-2 min-w-96"
        >
          <div className="flex gap-8 justify-end items-end">
            {props.title && (
              <h3 className="text-lg font-semibold pr-8">{props.title}</h3>
            )}
            <Button
              placeholder={<LucideX className="size-4" />}
              variant="secondary"
              click={props.onClose}
            />
          </div>
          <div className="flex flex-col gap-4">
            {props.description && (
              <p className="text-sm whitespace-pre-line leading-6">
                {props.description}
              </p>
            )}
            {props.children}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
