import { Link } from "react-router-dom";
import { useContext, useRef } from "react";
import styles from "./add.module.css"
import { SaveFlashcard, GetCurrentDateString } from "../../wailsjs/go/main/App";
import { useNavigate } from "react-router-dom";
import { main } from "../../wailsjs/go/models";
import { FlashcardContext } from "../contexts/FlashcardContext";

export default function AddPage() {
  const frontRef = useRef<HTMLInputElement | null>(null);
  const backRef = useRef<HTMLTextAreaElement | null>(null);
  const navigate = useNavigate();
  const cardCtx = useContext(FlashcardContext)

  return (
    <div id={styles.add} className="fade-up">
      <div id={styles.top_bar}>
        <Link to="/" className={`${styles.btn} ${styles.btnSecondaryBg} ${styles.iconBtn}`}>
          🠔
        </Link>
      </div>
      <div id={styles.main}>
        <span style={{ fontSize: '2rem', marginBottom: '2rem' }}>Add a new Flashcard</span>
        <div id={styles.user_input}>
          <input className={styles.text_input} type="text" placeholder="Front" ref={frontRef} />
          <textarea className={styles.text_input} rows={8} cols={20} placeholder="Back" ref={backRef} />
          <button
            className={`${styles.btn} ${styles.btnPrimaryGrad} ${styles.wFull}`}
            onClick={async () => {
              try {
                const flashcard = await SaveFlashcard(frontRef.current!.value, backRef.current!.value);
                console.log(flashcard)
                cardCtx.setFlashcards(prev => ({
                  ...prev,
                  [flashcard.id]: flashcard,
                }));
              } catch (err) {
                console.error(err);
              }
              navigate('/');
            }}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
