import { createContext, useEffect, useState } from "react";
import { GetAllFlashcards } from "../../wailsjs/go/main/App";
import { main } from "../../wailsjs/go/models";

// FlashcardMap consists of {ID, Flashcard} pairs.
export type FlashcardMap = Record<number, main.Flashcard>;

interface IFlashcardContextType {
  flashcards: FlashcardMap;
  setFlashcards: React.Dispatch<React.SetStateAction<FlashcardMap>>; // The type for useState's setter
}

// NOTE: this, along with Go's `Flashcard`, needs to be updated for each new field.
const defaultFlashcards: FlashcardMap = {};

export const FlashcardContext = createContext<IFlashcardContextType>({
  flashcards: defaultFlashcards,
  setFlashcards: () => { } // no-op
});

export const FlashcardProvider = ({ children }: any) => {
  const [flashcards, setFlashcards] = useState<FlashcardMap>(defaultFlashcards);

  // TODO
  useEffect(() => {
    (async () => {
      const cards = await GetAllFlashcards();
      setFlashcards(cards);
    })();
  }, []);

  return (
    <FlashcardContext.Provider value={{ flashcards, setFlashcards }}>
      {children}
    </FlashcardContext.Provider>
  );
};
