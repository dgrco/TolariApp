import { Link } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import styles from "./home.module.css"
import { FlashcardContext } from "../contexts/FlashcardContext";
import Flashcard from "../components/Flashcard";
import { main } from "../../wailsjs/go/models";

export default function HomePage() {
  const cardCtx = useContext(FlashcardContext);
  let cardMapKeys = useRef<number[]>([]);
  const [cardIndex, setCardIndex] = useState<number | null>(null);

  useEffect(() => {
    cardMapKeys.current = Object.keys(cardCtx.flashcards)
      .map(key => parseInt(key, 10));
    if (cardMapKeys.current.length > 0) {
      setCardIndex(0);
    }
  }, [cardCtx]);

  function remToPx(rem: number): number {
    const rootFontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    ); // in px
    return rem * rootFontSize;
  }

  return (
    <div id={styles.home} className="fade-up">
      <div id={styles.menu}>
        <div className={styles.spacer}></div>
        <div id={styles.nav}>
          <Link to="/review" className={`${styles.btn}`}>
            Review
          </Link>
          <Link to="/plan" className={`${styles.btn}`}>
            Plan
          </Link>
          <button className={`${styles.btn}`}>
            Timer
          </button>
        </div>
        <Link to="/settings" className={`${styles.btn} ${styles.btnSecondaryBg} ${styles.iconBtn}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={remToPx(1.5)}
            height={remToPx(1.5)}
            fill="currentColor"
          >
            <path d="M19.43 12.98c.04-.32.07-.66.07-1s-.03-.68-.07-1l2.11-1.65a.5.5 0 0 0 .12-.65l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1a6.96 6.96 0 0 0-1.73-1l-.38-2.65A.5.5 0 0 0 14 2h-4a.5.5 0 0 0-.5.42l-.38 2.65c-.63.24-1.21.56-1.73 1l-2.49-1a.5.5 0 0 0-.61.22l-2 3.46a.5.5 0 0 0 .12.65L4.57 11c-.04.32-.07.66-.07 1s.03.68.07 1l-2.11 1.65a.5.5 0 0 0-.12.65l2 3.46c.14.24.42.34.61.22l2.49-1c.52.44 1.1.76 1.73 1l.38 2.65c.04.26.25.45.5.45h4c.25 0 .46-.19.5-.42l.38-2.65c.63-.24 1.21-.56 1.73-1l2.49 1c.19.12.47.02.61-.22l2-3.46a.5.5 0 0 0-.12-.65L19.43 13zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" />
          </svg>
        </Link>
      </div>
      <div id={styles.main}>
        <div id={styles.cardContainer}>
          {
            cardMapKeys.current.length > 1 &&
            <button className={`${styles.btn} ${styles.btnSecondaryBg}`}
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
          {
            cardIndex !== null ?
              (
                <div key={cardIndex} id={styles.cardWrapper}>
                  <Flashcard card={cardCtx.flashcards[cardMapKeys.current[cardIndex]]} />
                </div>
              ) :
              <p>No Cards to Display</p>
          }
          {
            cardMapKeys.current.length > 1 &&
            <button className={`${styles.btn} ${styles.btnSecondaryBg}`}
              onClick={() => {
                if (cardIndex !== null) {
                  setCardIndex((cardIndex + 1) % cardMapKeys.current.length)
                }
              }}>
              <span>&#8594;</span>
            </button>
          }
        </div>
        {cardIndex !== null && <p>{cardIndex + 1} / {cardMapKeys.current.length}</p>}
      </div>
      <div id={styles.bottomBar}>
        <Link to="/add" className={`${styles.btn} ${styles.btnPrimaryGrad}`}>
          +
          <span style={{ marginLeft: '0.2rem' }}>Add</span>
        </Link>
      </div>
    </div>
  );
}
