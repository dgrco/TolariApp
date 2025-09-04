import { createContext, useContext, useState } from "react";
import { main } from "../../wailsjs/go/models";

interface DragContextType {
  draggingCard: main.KanbanCard | null;
  setDraggingCard: (card: main.KanbanCard | null) => void;
  cursorPosition: { x: number, y: number };
  setCursorPosition: (pos: { x: number, y: number }) => void;
  indicatorBefore: string | null;
  setIndicatorBefore: (id: string | null) => void;
  targetColumnId: string | null;
  setTargetColumnId: (id: string | null) => void;
}

const DragContext = createContext<DragContextType | null>(null);

export const useDragContext = () => {
  const ctx = useContext(DragContext);
  if (!ctx) throw new Error("useDragContext must be used inside DragProvider");
  return ctx;
}

export const DragProvider = ({ children }: { children: React.ReactNode }) => {
  const [draggingCard, setDraggingCard] = useState<main.KanbanCard | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [indicatorBefore, setIndicatorBefore] = useState<string | null>(null);
  const [targetColumnId, setTargetColumnId] = useState<string | null>(null);

  return (
    <DragContext.Provider
      value={{
        draggingCard,
        setDraggingCard,
        cursorPosition, 
        setCursorPosition,
        indicatorBefore: indicatorBefore,
        setIndicatorBefore: setIndicatorBefore,
        targetColumnId,
        setTargetColumnId,
      }}
    >
      {children}
    </DragContext.Provider>
  )
}
