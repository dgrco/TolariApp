import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetReviewCards, ReviewCard } from "../../wailsjs/go/main/App";
import { main } from "../../wailsjs/go/models";
import Flashcard from "../components/Flashcard";
import { FlashcardContext } from "../contexts/FlashcardContext";
import styles from "./review.module.css";

export default function Review() {
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
    <div id={styles.review} className="fade-up">
      <div id={styles.topBar}>
        <Link to="/" className={`${styles.btn} ${styles.btnSecondaryBg}`}>
          🠔
          &nbsp;
          Exit Review
        </Link>
      </div>
      <div id={styles.main}>
        <div id={styles.cardContainer}>
          {
            reviewCardIndex !== null && reviewCardIndex < reviewCards.length ?
              (<div key={reviewCardIndex} id={styles.cardWrapper}>
                <Flashcard card={reviewCards[reviewCardIndex]} />
              </div>) :
              <p>No Cards to Review</p>
          }
        </div>
        {
          reviewCardIndex !== null && reviewCardIndex < reviewCards.length &&
          <>
            <p className={styles.question}>How well did you recall this?</p>
            <div id={styles.bottomBar}>
              <button
                className={`${styles.btn} ${styles.btnOutline} ${styles.btnLerp1}`}
                onClick={async () => {
                  if (reviewCardIndex !== null) {
                    const cardID = reviewCards[reviewCardIndex].id;
                    console.log(cardID);
                    try {
                      const updatedCard = await ReviewCard(cardID, 0);
                      cardCtx.setFlashcards(prev => ({
                        ...prev,
                        [updatedCard.id]: updatedCard,
                      }));
                      setReviewCardIndex(reviewCardIndex + 1);
                      console.log(updatedCard.review_date);
                    } catch (err) {
                      console.error(err);
                    }
                  }
                }}>Wrong</button>
              <button
                className={`${styles.btn} ${styles.btnOutline} ${styles.btnLerp2}`}
                onClick={async () => {
                  if (reviewCardIndex !== null) {
                    const cardID = reviewCards[reviewCardIndex].id;
                    try {
                      const updatedCard = await ReviewCard(cardID, 3);
                      cardCtx.setFlashcards(prev => ({
                        ...prev,
                        [updatedCard.id]: updatedCard,
                      }));
                      setReviewCardIndex(reviewCardIndex + 1);
                      console.log(updatedCard.review_date);
                    } catch (err) {
                      console.error(err);
                    }
                  }
                }}>Hard</button>
              <button
                className={`${styles.btn} ${styles.btnOutline} ${styles.btnLerp3}`}
                onClick={async () => {
                  if (reviewCardIndex !== null) {
                    const cardID = reviewCards[reviewCardIndex].id;
                    try {
                      const updatedCard = await ReviewCard(cardID, 4);
                      cardCtx.setFlashcards(prev => ({
                        ...prev,
                        [updatedCard.id]: updatedCard,
                      }));
                      setReviewCardIndex(reviewCardIndex + 1);
                      console.log(updatedCard.review_date);
                    } catch (err) {
                      console.error(err);
                    }
                  }
                }}>Fair</button>
              <button
                className={`${styles.btn} ${styles.btnOutline} ${styles.btnLerp4}`}
                onClick={async () => {
                  if (reviewCardIndex !== null) {
                    const cardID = reviewCards[reviewCardIndex].id;
                    try {
                      const updatedCard = await ReviewCard(cardID, 5);
                      cardCtx.setFlashcards(prev => ({
                        ...prev,
                        [updatedCard.id]: updatedCard,
                      }));
                      setReviewCardIndex(reviewCardIndex + 1);
                      console.log(updatedCard.review_date);
                    } catch (err) {
                      console.error(err);
                    }
                  }
                }}>Easy</button>
            </div>
          </>
        }
      </div>
    </div>
  )
}
