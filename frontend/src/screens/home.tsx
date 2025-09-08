import { Link } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { FlashcardContext } from "../contexts/FlashcardContext";
import Flashcard from "../components/Flashcard";
import { main } from "../../wailsjs/go/models";
import { motion, AnimatePresence } from "framer-motion";

// No more styles.css file, all styling is handled with Tailwind.
export default function HomePage() {
  const cardCtx = useContext(FlashcardContext);
  let cardMapKeys = useRef<number[]>([]);
  const [cardIndex, setCardIndex] = useState<number | null>(null);

  useEffect(() => {
    cardMapKeys.current = Object.keys(cardCtx.flashcards).map(key => parseInt(key, 10));
    if (cardMapKeys.current.length > 0) {
      setCardIndex(0);
    }
  }, [cardCtx]);

  // The remToPx function is no longer needed since we are using Tailwind's rem units directly.
  const svgSize = "1.5rem";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col justify-between h-screen text-center"
    >
      <div className="flex justify-between items-center m-4">
        <div className="h-9 w-9"></div>
        <div className="flex justify-around w-1/3 bg-dark-secondary rounded-full">
          <Link to="/review" className="flex-1 p-2 rounded-l-full border-r border-border hover:bg-dark-secondary-hover transition-colors duration-200">
            Review
          </Link>
          <Link to="/plan" className="flex-1 p-2 hover:bg-dark-secondary-hover transition-colors duration-200">
            Plan
          </Link>
          <button className="flex-1 p-2 rounded-r-full hover:bg-dark-secondary-hover border-l border-border transition-colors duration-200">
            Timer
          </button>
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
          {cardMapKeys.current.length > 1 &&
            <button
              className="m-4 h-12 w-12 text-2xl bg-dark-secondary rounded-full hover:bg-dark-secondary-hover transition-colors duration-200"
              onClick={() => {
                if (cardIndex === null)
                  return;
                if (cardIndex === 0) {
                  setCardIndex(cardMapKeys.current.length - 1);
                } else {
                  setCardIndex(cardIndex - 1);
                }
              }}>
              <span>&#8592;</span>
            </button>
          }
          <AnimatePresence mode="wait">
            {cardIndex !== null ?
              (
                <Flashcard key={cardIndex} card={cardCtx.flashcards[cardMapKeys.current[cardIndex]]} />
              ) :
              <p>No Cards to Display</p>
            }
          </AnimatePresence>
          {cardMapKeys.current.length > 1 &&
            <button
              className="m-4 h-12 w-12 text-2xl bg-dark-secondary rounded-full hover:bg-dark-secondary-hover transition-colors duration-200"
              onClick={() => {
                if (cardIndex !== null) {
                  setCardIndex((cardIndex + 1) % cardMapKeys.current.length);
                }
              }}>
              <span>&#8594;</span>
            </button>
          }
        </div>
        <div className="mt-4">
          {cardIndex !== null && <p>{cardIndex + 1} / {cardMapKeys.current.length}</p>}
        </div>
      </div>
      <div className="flex m-4 justify-center font-semibold">
        <Link to="/add" className="w-40 h-8 text-base p-1 mb-6 rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-85 transition-opacity duration-200 flex items-center justify-center">
          <span>+</span>
          <span className="ml-1">Add</span>
        </Link>
      </div>
      <style>
        {`
        @keyframes popIn {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-popIn {
          animation: popIn 0.2s ease-in forwards;
        }
      `}
      </style>
    </motion.div>
  );
}
