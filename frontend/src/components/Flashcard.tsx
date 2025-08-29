import { main } from "../../wailsjs/go/models";
import { useState } from "react";
import styles from "./Flashcard.module.css";

interface IProps {
  card: main.Flashcard;
}

export default function Flashcard(props: IProps) {
  const [showFront, setShowFront] = useState(true);
  const [flipped, setFlipped] = useState(false);
  const [key, setKey] = useState(0);

  const handleFlip = () => {
    setFlipped(true); // Enable the flip animation on first click
    setKey((key + 1) % 2); // Trick to re-render card
    setShowFront(!showFront)
  }

  return (
    <div className={`${styles.card} ${styles.btn} ${flipped && styles.flip_in}`} key={key}
      onClick={handleFlip}>
      <textarea readOnly className={styles.card_text}
        value={showFront ? props.card.front : props.card.back} />
      <p className={styles.side}>({showFront ? "front" : "back"})</p>
    </div>
  )
}
