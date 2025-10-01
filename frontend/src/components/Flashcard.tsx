import { main } from "../../wailsjs/go/models";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EditIcon, SwitchSidesIcon } from "./SVGComponents";

interface Props {
  card: main.Flashcard | null;
  editMode?: boolean;
  frontEditRef?: React.MutableRefObject<string | null>;
  backEditRef?: React.MutableRefObject<string | null>;
}

const Flashcard = ({ card, editMode: editMode = false, frontEditRef, backEditRef }: Props) => {
  const [showFront, setShowFront] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleFlip = () => {
    setShowFront((prev) => !prev);
  }

  useEffect(() => {
    if ((editMode || !card) && contentRef.current) {
      if (!frontEditRef || !backEditRef) console.error("You need to set edit references!");
      if (showFront) {
        contentRef.current.innerText = frontEditRef!.current || "";
      } else {
        contentRef.current.innerText = backEditRef!.current || "";
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

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.focus();
    }
  }, [cardRef])

  if (card === null || editMode) {
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
          title="Shortcut: <Tab>"
        >
          <SwitchSidesIcon />
        </motion.span>

        {/* Editable Content */}
        <div
          ref={contentRef}
          className="w-[90%] h-full mt-8 resize-none bg-transparent text-white border-none text-3xl outline-none select-none text-start overflow-y-auto pr-4 overflow-x-hidden"
          contentEditable
          onInput={() => {
            if (!frontEditRef || !backEditRef) console.error("You need to set edit references!");
            if (contentRef.current) {
              if (showFront) {
                frontEditRef!.current = contentRef.current.innerText;
              } else {
                backEditRef!.current = contentRef.current.innerText;
              }
            }
          }}
          onKeyDown={(event) => {
            if (event.key === 'Tab') {
              event.preventDefault();
              handleFlip()
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
      ref={cardRef}
      tabIndex={0}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.1, ease: "easeInOut" } }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95, transition: { type: "spring", stiffness: 400, damping: 20 } }}
      className="relative flex items-center justify-center bg-dark-secondary h-[60vh] w-[70vw] max-w-[65rem] rounded-2xl border-2 border-border cursor-default outline-none"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleFlip}
      onKeyDown={(e) => {
        if (e.code === "Space" || e.key === " ") {
          e.preventDefault(); // prevents page from scrolling
          handleFlip();
        }
      }}
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
              title="Shortcut: <Space>"
            >
              <SwitchSidesIcon />
            </motion.span>
          }
        </AnimatePresence>

        <div
          className="w-[90%] h-full mt-8 resize-none bg-transparent text-white border-none text-3xl outline-none select-none overflow-y-auto pr-4 cursor-default text-left"
        >
          {showFront ? card.front : card.back}
        </div>

        <p className="opacity-60 text-white mb-6 mt-6 cursor-default select-none">{showFront ? 'FRONT' : 'BACK'}</p>
      </div>
    </motion.div >
  );
}

export default Flashcard;
