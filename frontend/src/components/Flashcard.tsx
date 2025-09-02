import { main } from "../../wailsjs/go/models";
import { useState } from "react";

interface IProps {
  card: main.Flashcard;
}

export default function Flashcard(props: IProps) {
  const [showFront, setShowFront] = useState(true);

  const handleFlip = () => {
    setShowFront(!showFront)
  }

  return (
    <>
      <div
        className="flex flex-col bg-dark-secondary h-[60vh] w-[70vw] max-w-[65rem] justify-center items-center rounded-2xl transition-all duration-200 ease-in-out hover:scale-[101%] hover:bg-dark-secondary-hover cursor-pointer active:scale-100"
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
      </div>
    </>
  );
}
