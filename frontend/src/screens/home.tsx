import { Link } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { FlashcardContext } from "../contexts/FlashcardContext";
import Flashcard from "../components/Flashcard";
import { motion, AnimatePresence } from "framer-motion";
import TimerWidget from "../components/TimerWidget";
import { CheckIcon, EditIcon, TrashIcon } from "../components/SVGComponents";
import { DeleteFlashcard, ModifyFlashcard } from "../../wailsjs/go/main/App";

enum CardMode {
  READ,
  EDIT,
}

// No more styles.css file, all styling is handled with Tailwind.
export default function HomePage() {
  const cardCtx = useContext(FlashcardContext);
  const [cardKeys, setCardKeys] = useState<number[]>([]);
  const [cardIndex, setCardIndex] = useState<number | null>(null);
  const activeCardId = cardIndex !== null ? cardKeys[cardIndex] : null;
  const [mode, setMode] = useState<CardMode>(CardMode.READ);

  // When editing, these update the the front/back content of the active card
  const frontEditRef = useRef<string | null>(null);
  const backEditRef = useRef<string | null>(null);

  useEffect(() => {
    const keys = Object.keys(cardCtx.flashcards).map(key => parseInt(key, 10));
    setCardKeys(keys);

    if (keys.length === 0) {
      setCardIndex(null);
      return;
    }

    setCardIndex((prev) =>
      prev === null ? 0 : Math.min(prev, keys.length - 1)
    );
  }, [cardCtx.flashcards]);

  // The remToPx function is no longer needed since we are using Tailwind's rem units directly.
  const svgSize = "1.5rem";

  const editCard = () => {
    if (activeCardId === null) return;

    frontEditRef.current = cardCtx.flashcards[activeCardId].front;
    backEditRef.current = cardCtx.flashcards[activeCardId].back;
    setMode(CardMode.EDIT);
  }

  const editCleanup = () => {
    setMode(CardMode.READ);
    frontEditRef.current = null;
    backEditRef.current = null;
  }

  const updateCard = () => {
    const front = frontEditRef.current;
    const back = backEditRef.current;
    if (!activeCardId || !front || !back) {
      return;
    }

    // Edit in-memory
    cardCtx.setFlashcards(prev => ({
      ...prev,
      [activeCardId]: {
        ...prev[activeCardId],
        front: frontEditRef.current!,
        back: backEditRef.current!,
      }
    }));

    // Save to disk
    (async () => {
      await ModifyFlashcard(activeCardId, front, back)
    })();

    editCleanup();
  }

  const deleteCard = () => {
    if (activeCardId === null) return;

    // Remove card in-memory
    cardCtx.setFlashcards((prev) => {
      const { [activeCardId]: deletedCard, ...updated } = prev;
      return updated;
    });

    // Save changes to disk
    (async () => {
      await DeleteFlashcard(activeCardId);
    })();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col justify-between h-screen text-center overflow-y-hidden"
    >
      <div className="flex justify-between items-center m-4">
        <div className="h-9 w-9">{/*Spacer*/}</div>
        <div className="absolute top-1 left-1">
          <TimerWidget
            size={6} // in rem
            embed={true}
          />
        </div>
        <div className="flex justify-around w-1/3 bg-dark-secondary rounded-full">
          <Link to="/review" className="flex-1 p-2 rounded-l-full border-r border-border hover:bg-dark-secondary-hover transition-colors duration-200">
            Review
          </Link>
          <Link to="/plan" className="flex-1 p-2 hover:bg-dark-secondary-hover transition-colors duration-200">
            Plan
          </Link>
          <Link to="/timer" className="flex-1 p-2 rounded-r-full hover:bg-dark-secondary-hover border-l border-border transition-colors duration-200">
            Timer
          </Link>
        </div>
        <Link to="/settings" className="p-2 bg-dark-secondary rounded-full hover:bg-dark-secondary-hover transition-colors duration-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={svgSize}
            height={svgSize}
            fill="currentColor"
          >
            <path d="M19.43 12.98c.04-.32.07-.66.07-1s-.03-.68-.07-1l2.11-1.65a.5.5 0 0 0 .12-.65l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1a6.96 6.96 0 0 0-1.73-1l-.38-2.65A.5.5 0 0 0 14 2h-4a.5.5 0 0 0-.5.42l-.38 2.65c-.63.24-1.21.56-1.73 1l-2.49-1a.5.5 0 0 0-.61.22l-2 3.46a.5.5 0 0 0 .12.65L4.57 11c-.04.32-.07.66-.07 1s.03.68.07 1l-2.11 1.65a.5.5 0 0 0-.12.65l2 3.46c.14.24.42.34.61.22l2.49-1c.52.44 1.1.76 1.73 1l.38 2.65c.04.26.25.45.5.45h4c.25 0 .46-.19.5-.42l.38-2.65c.63-.24 1.21-.56 1.73-1l2.49 1c.19.12.47.02.61-.22l2-3.46a.5.5 0 0 0-.12-.65L19.43 13zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" />
          </svg>
        </Link>
      </div>
      <div className="flex flex-col items-center m-4">
        <div className="flex justify-between items-center">
          {cardKeys.length > 1 && mode === CardMode.READ && 
            <button
              className="m-4 h-12 w-12 text-2xl bg-dark-secondary rounded-full hover:bg-dark-secondary-hover transition-colors duration-200 select-none"
              onClick={() => {
                if (cardIndex === null)
                  return;
                if (cardIndex === 0) {
                  setCardIndex(cardKeys.length - 1);
                } else {
                  setCardIndex(cardIndex - 1);
                }
              }}>
              <span>&#8592;</span>
            </button>
          }
          <AnimatePresence mode="wait">
            {activeCardId && cardCtx.flashcards[activeCardId] ?
              (
                <Flashcard
                  key={activeCardId}
                  card={cardCtx.flashcards[activeCardId]}
                  editMode={mode === CardMode.EDIT}
                  frontEditRef={frontEditRef}
                  backEditRef={backEditRef}
                />
              ) :
              <p>No Cards to Display</p>
            }
          </AnimatePresence>
          {cardKeys.length > 1 && mode === CardMode.READ && 
            <button
              className="m-4 h-12 w-12 text-2xl bg-dark-secondary rounded-full hover:bg-dark-secondary-hover transition-colors duration-200 select-none"
              onClick={() => {
                if (cardIndex !== null) {
                  setCardIndex((cardIndex + 1) % cardKeys.length);
                }
              }}>
              <span>&#8594;</span>
            </button>
          }
        </div>
        <div className="flex w-[70vw] mt-4">
          {cardIndex !== null &&
            <AnimatePresence mode="wait">
              {mode === CardMode.READ ?
                <motion.div
                  key="read"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.075 }}
                  className="flex flex-1 justify-between items-center"
                >
                  <span className="w-[12.5rem]">{/* Spacer */}</span>
                  <p className="w-24">{cardIndex + 1} / {cardKeys.length}</p>
                  <div className="flex gap-2">
                    <button
                      className="flex bg-secondary w-24 h-8 rounded-full justify-center items-center hover:opacity-85 transition-opacity cursor-pointer"
                      onClick={editCard}
                    >
                      <span className="mr-2">
                        <EditIcon />
                      </span>
                      Edit
                    </button>
                    <button
                      className="flex bg-error w-24 h-8 rounded-full justify-center items-center hover:opacity-85 transition-opacity cursor-pointer select-none"
                      onClick={deleteCard}
                    >
                      <span className="mr-2">
                        <TrashIcon />
                      </span>
                      Delete
                    </button>
                  </div>
                </motion.div> :
                <motion.div
                  key="edit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.075 }}
                  className="flex flex-1 justify-between items-center"
                >
                  <span className="w-[12.5rem]">{/* Spacer */}</span>
                  <p className="w-24">{cardIndex + 1} / {cardKeys.length}</p>
                  <div className="flex gap-2">
                    <button
                      className="flex bg-dark-secondary w-24 h-8 rounded-full justify-center items-center hover:opacity-85 transition-opacity cursor-pointer"
                      onClick={editCleanup}
                    >
                      <span className="mr-2">
                        ×
                      </span>
                      Cancel
                    </button>
                    <button
                      className="flex bg-success w-24 h-8 rounded-full justify-center items-center hover:opacity-85 transition-opacity cursor-pointer select-none"
                      onClick={updateCard}
                    >
                      <span className="mr-2">
                        <CheckIcon />
                      </span>
                      Save
                    </button>
                  </div>
                </motion.div>
              }
            </AnimatePresence>
          }
        </div>
      </div>
      <div className="flex m-4 justify-center font-semibold">
        <Link to="/add" className="w-40 h-8 text-base p-1 mb-6 rounded-full bg-primary hover:opacity-85 transition-opacity duration-200 flex items-center justify-center select-none">
          <span>+</span>
          <span className="ml-1">Add</span>
        </Link>
      </div>
    </motion.div>
  );
}
