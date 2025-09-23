import { useContext, useRef } from "react";
import { SaveFlashcard } from "../../wailsjs/go/main/App";
import { Link, useNavigate } from "react-router-dom";
import { FlashcardContext } from "../contexts/FlashcardContext";
import { motion } from "framer-motion";

export default function AddPage() {
  const frontRef = useRef<HTMLInputElement | null>(null);
  const backRef = useRef<HTMLTextAreaElement | null>(null);
  const navigate = useNavigate();
  const cardCtx = useContext(FlashcardContext);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-screen p-4 bg-dark"
    >
      <div className="flex justify-start">
        <Link to="/" className="p-2 w-10 h-10 bg-dark-secondary text-xl rounded-full flex items-center justify-center hover:bg-dark-secondary-hover transition-colors duration-200">
          &#8592;
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center flex-1">
        <span className="text-2xl mb-8">Add a new Flashcard</span>
        <div className="flex flex-col w-full max-w-lg space-y-4 justify-between">
          <input
            className="w-full p-4 rounded-lg bg-dark-secondary placeholder-muted border-2 border-border focus:outline-none focus:border-primary-hover transition-colors duration-200"
            type="text"
            placeholder="Front"
            ref={frontRef}
          />
          <textarea
            className="w-full p-4 rounded-lg bg-dark-secondary placeholder-muted border-2 border-border focus:outline-none focus:border-primary-hover transition-colors duration-200 resize-none"
            rows={8}
            cols={20}
            placeholder="Back"
            ref={backRef}
          />
        </div>
        <button
          className="flex items-center justify-center w-40 h-8 text-base p-1 mb-6 rounded-full bg-primary hover:opacity-85 transition-opacity duration-200 mt-10"
          onClick={async () => {
            try {
              const flashcard = await SaveFlashcard(frontRef.current!.value, backRef.current!.value);
              cardCtx.setFlashcards(prev => ({
                ...prev,
                [flashcard.id]: flashcard,
              }));
            } catch (err) {
              console.error(err);
            }
            navigate('/');
          }}
        >
          Add
        </button>
      </div>
    </motion.div>
  );
}
