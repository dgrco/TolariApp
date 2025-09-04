import { main } from "../../wailsjs/go/models";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IProps {
  card: main.Flashcard;
}

export default function Flashcard(props: IProps) {
  const [showFront, setShowFront] = useState(true);

  const handleFlip = () => {
    setShowFront(!showFront)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{opacity: 0, y: 50}}
        animate={{opacity: 1, y: 0}}
        whileHover={{scale: 1.02}}
        whileTap={{scale: 1}}
        className="flex flex-col bg-dark-secondary h-[60vh] w-[70vw] max-w-[65rem] justify-center items-center rounded-2xl cursor-pointer"
        onClick={handleFlip}
      >
        <textarea
          readOnly
          className="w-[90%] h-full mt-8 resize-none bg-transparent text-white border-none text-3xl outline-none select-none hover:cursor-pointer"
          value={showFront ? props.card.front : props.card.back}
        />
        <p className="opacity-60 text-white mb-4">
          ({showFront ? "front" : "back"})
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
