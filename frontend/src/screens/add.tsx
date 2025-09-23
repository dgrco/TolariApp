import { useContext, useEffect, useRef } from "react";
import { SaveFlashcard } from "../../wailsjs/go/main/App";
import { Link, useNavigate } from "react-router-dom";
import { FlashcardContext } from "../contexts/FlashcardContext";
import { motion } from "framer-motion";
import { CheckIcon } from "../components/SVGComponents";
import Flashcard from "../components/Flashcard";

export default function AddPage() {
  const frontRef = useRef<string | null>(null);
  const backRef = useRef<string | null>(null);
  const navigate = useNavigate();
  const cardCtx = useContext(FlashcardContext);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-screen w-screen p-4 bg-dark overflow-hidden"
    >
      <div className="flex justify-start">
        <Link draggable="false" to="/" className="p-2 w-10 h-10 bg-dark-secondary text-xl rounded-full flex items-center justify-center hover:bg-dark-secondary-hover transition-colors duration-200">
          &#8592;
        </Link>
      </div>
      <div className="flex w-full h-full flex-col space-y-4 justify-center items-center">
        <Flashcard
          frontEditRef={frontRef}
          backEditRef={backRef}
          card={null} // card={null} forces edit mode, no need to set editMode={true}
        />
        <button
          className="flex items-center justify-center w-32 h-8 text-base p-1 mb-6 rounded-full bg-success hover:opacity-85 transition-opacity duration-200 mt-10"
          onClick={async () => {
            try {
              const flashcard = await SaveFlashcard(frontRef.current!, backRef.current!);
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
          <span className="mr-2">
            <CheckIcon />
          </span>
          Save
        </button>
      </div>
    </motion.div>
  );
}
