import { Link } from "react-router-dom";
import { useContext, useRef } from "react";
import { SaveFlashcard } from "../../wailsjs/go/main/App";
import { useNavigate } from "react-router-dom";
import { FlashcardContext } from "../contexts/FlashcardContext";

export default function AddPage() {
  const frontRef = useRef<HTMLInputElement | null>(null);
  const backRef = useRef<HTMLTextAreaElement | null>(null);
  const navigate = useNavigate();
  const cardCtx = useContext(FlashcardContext);

  return (
    <div className="flex flex-col h-screen p-4 bg-dark">
      <div className="flex justify-start">
        <Link to="/" className="p-2 w-10 h-10 bg-dark-secondary text-xl rounded-full flex items-center justify-center hover:bg-dark-secondary-hover transition-colors duration-200">
          &#8592;
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center flex-1">
        <span className="text-2xl mb-8">Add a new Flashcard</span>
        <div className="flex flex-col w-full max-w-lg space-y-4">
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
          <button
            className="w-full py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-80 transition-colors duration-200"
            onClick={async () => {
              try {
                const flashcard = await SaveFlashcard(frontRef.current!.value, backRef.current!.value);
                console.log(flashcard);
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
      </div>
    </div>
  );
}
