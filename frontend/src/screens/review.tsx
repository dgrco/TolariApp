import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetReviewCards, ReviewCard } from "../../wailsjs/go/main/App";
import { main } from "../../wailsjs/go/models";
import Flashcard from "../components/Flashcard";
import TimerWidget from "../components/TimerWidget";
import { FlashcardContext } from "../contexts/FlashcardContext";
import { usePomodoroContext } from "../contexts/PomodoroContext";
import { motion } from "framer-motion";

export default function Review() {
  const pomodoroContext = usePomodoroContext();
  const cardCtx = useContext(FlashcardContext);
  const [reviewCards, setReviewCards] = useState<main.Flashcard[]>([]);
  const [reviewCardIndex, setReviewCardIndex] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const cards = await GetReviewCards();
      setReviewCards(cards);

      if (cards.length > 0) {
        setReviewCardIndex(0);
      }
    })();
  }, []);

  return (
    <motion.div 
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      className="flex flex-col h-screen p-6 bg-dark"
    >
      <div className="flex justify-start">
        <Link draggable="false" to="/" className="select-none px-4 py-2 rounded-full bg-dark-secondary flex items-center justify-center hover:bg-dark-secondary-hover transition-colors duration-200">
          &#8592;
          <span className="ml-2">Exit Review</span>
        </Link>
        <div className="absolute top-1 right-1">
          <TimerWidget
            size={6} // in rem
            embed={true}
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="w-full flex items-center justify-center mb-8">
          {
            reviewCardIndex !== null && reviewCardIndex < reviewCards.length ?
              (<div key={reviewCardIndex}>
                <Flashcard card={reviewCards[reviewCardIndex]} />
              </div>) :
              <p className="-mt-10">No Cards to Review</p>
          }
        </div>
        {
          reviewCardIndex !== null && reviewCardIndex < reviewCards.length &&
          <div>
            <p className="text-lg text-muted text-center mt-auto mb-4">How well did you recall this?</p>
            <div className="w-full flex justify-center gap-4 mb-8">
              <button
                className="select-none w-28 h-10 tracking-wide rounded-full border border-border transition-colors duration-200 hover:bg-error hover:border-error"
                onClick={async () => {
                  if (reviewCardIndex !== null) {
                    const cardID = reviewCards[reviewCardIndex].id;
                    try {
                      await ReviewCard(cardID, 0);
                      setReviewCardIndex(reviewCardIndex + 1);
                    } catch (err) {
                      console.error(err);
                    }
                  }
                }}>Fail</button>
              <button
                className="select-none w-28 h-10 tracking-wide rounded-full border border-border transition-colors duration-200 hover:bg-warning hover:border-warning"
                onClick={async () => {
                  if (reviewCardIndex !== null) {
                    const cardID = reviewCards[reviewCardIndex].id;
                    try {
                      await ReviewCard(cardID, 3);
                      setReviewCardIndex(reviewCardIndex + 1);
                    } catch (err) {
                      console.error(err);
                    }
                  }
                }}>Hard</button>
              <button
                className="select-none w-28 h-10 tracking-wide rounded-full border border-border transition-colors duration-200 hover:bg-secondary hover:border-secondary"
                onClick={async () => {
                  if (reviewCardIndex !== null) {
                    const cardID = reviewCards[reviewCardIndex].id;
                    try {
                      await ReviewCard(cardID, 4);
                      setReviewCardIndex(reviewCardIndex + 1);
                    } catch (err) {
                      console.error(err);
                    }
                  }
                }}>Fair</button>
              <button
                className="select-none w-28 h-10 tracking-wide rounded-full border border-border transition-colors duration-200 hover:bg-success hover:border-success"
                onClick={async () => {
                  if (reviewCardIndex !== null) {
                    const cardID = reviewCards[reviewCardIndex].id;
                    try {
                      await ReviewCard(cardID, 5);
                      setReviewCardIndex(reviewCardIndex + 1);
                    } catch (err) {
                      console.error(err);
                    }
                  }
                }}>Easy</button>
            </div>
          </div>
        }
      </div>
    </motion.div>
  )
}
