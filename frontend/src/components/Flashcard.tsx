import { main } from "../../wailsjs/go/models";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EditIcon, SwitchSidesIcon, TrashIcon } from "./SVGComponents";

interface Props {
  card: main.Flashcard;
  editMode?: boolean;
  frontEditRef: React.MutableRefObject<string | null>;
  backEditRef: React.MutableRefObject<string | null>;
}

const Flashcard = ({ card, editMode: editMode = false, frontEditRef, backEditRef }: Props) => {
  const [showFront, setShowFront] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleFlip = () => {
    setShowFront((prev) => !prev);
  }

  useEffect(() => {
    if (editMode && contentRef.current) {
      if (showFront) {
        contentRef.current.innerText = frontEditRef.current || "";
      } else {
        contentRef.current.innerText = backEditRef.current || "";
      }
      contentRef.current.focus();
      // Place cursor at end
      const range = document.createRange();
      range.selectNodeContents(contentRef.current);
      range.collapse(false); // false -> cursor at the end
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }, [editMode, showFront]);

  if (editMode) {
    return (
      <motion.div
        className="relative flex flex-col bg-dark-secondary h-[60vh] w-[70vw] max-w-[65rem] justify-center items-center rounded-2xl border-2 border-secondary transition-colors"
      >
        {/* Flip Button */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "inset 0 0 10px 100px rgba(0, 0, 0, 0.1)",
          }}
          whileTap={{ scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="select-none cursor-pointer absolute bottom-2 right-2 bg-dark-secondary-hover p-4 rounded-full"
          onClick={handleFlip}
        >
          <SwitchSidesIcon />
        </motion.span>

        {/* Editable Content */}
        <div
          ref={contentRef}
          className="w-[90%] h-full mt-8 resize-none bg-transparent text-white border-none text-3xl outline-none select-none text-start overflow-y-auto pr-4 overflow-x-hidden"
          contentEditable
          onInput={() => {
            if (contentRef.current) {
              if (showFront) {
                frontEditRef.current = contentRef.current.innerText;
              } else {
                backEditRef.current = contentRef.current.innerText;
              }
            }
          }}
        />

        {/* Front/Back Label */}
        <p className="opacity-60 text-white mb-6 mt-6">
          {showFront ? "FRONT" : "BACK"}
        </p>
      </motion.div>
    );
  }

  // Read Mode
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.1, ease: "easeInOut" } }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95, transition: { type: "spring", stiffness: 400, damping: 20 } }}
      className="relative flex items-center justify-center bg-dark-secondary h-[60vh] w-[70vw] max-w-[65rem] rounded-2xl border-2 border-border cursor-default"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleFlip}
    >
      <div
        className="absolute w-full h-full flex flex-col justify-center items-center"
      >
        <AnimatePresence mode="wait">
          {isHovering &&
            <motion.span
              key="switch-icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              className="select-none absolute bottom-4 right-4 p-2"
            >
              <SwitchSidesIcon />
            </motion.span>
          }
        </AnimatePresence>

        <textarea
          readOnly
          className="w-[90%] h-full mt-8 resize-none bg-transparent text-white border-none text-3xl outline-none select-none overflow-y-auto pr-4 cursor-default"
          style={{scrollbarGutter: 'stable'}}
          value={showFront ? card.front : card.back}
        />

        <p className="opacity-60 text-white mb-6 mt-6 cursor-default select-none">{showFront ? 'FRONT' : 'BACK'}</p>
      </div>
    </motion.div>
  );
}

export default Flashcard;
