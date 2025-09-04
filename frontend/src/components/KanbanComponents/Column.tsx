import { Card, DropIndicator } from "./Card";
import { main } from "../../../wailsjs/go/models";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useDragContext } from "../../contexts/DragContext";

interface ColumnProps {
  title: string,
  id: string,
  cards: main.KanbanCard[],
  setCards: React.Dispatch<React.SetStateAction<main.KanbanCard[]>>
}

export default function Column({ title, id, cards, setCards }: ColumnProps) {
  const [active, setActive] = useState(false)
  const { setIndicatorBefore, setTargetColumnId } = useDragContext();

  const filteredCards = useMemo(
    () => cards.filter(card => card.columnId === id),
    [cards, id]
  );

  const handleDragStart = (e: DragEvent, card: main.KanbanCard) => {
    e.dataTransfer?.setData('cardId', card.id);
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  }

  const highlightIndicator = (e: React.DragEvent) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const nearestIndicator = getNearestIndicator(e, indicators);
    nearestIndicator.element.style.opacity = "1";
  }

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();

    indicators.forEach(indicator => {
      indicator.style.opacity = "0";
    })
  }

  const getIndicators = () => {
    return Array.from(document.querySelectorAll<HTMLElement>(`[data-column-id="${id}"]`));
  }

  const getNearestIndicator = (e: React.DragEvent, indicators: HTMLElement[]) => {
    const DISTANCE_OFFSET = 50;
    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child }
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1]
      }
    )

    return el;
  }

  const handleDragLeave = () => {
    setActive(false);
    clearHighlights();
  }

  const handleDragEnd = (e: React.DragEvent) => {
    setActive(false);
    clearHighlights();

    const cardId = e.dataTransfer.getData('cardId');
    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...cards];

      let cardToTransfer = copy.find(card => card.id === cardId);
      console.log(copy, cardId)

      if (!cardToTransfer) return;

      cardToTransfer = { ...cardToTransfer, columnId: id }
      
      copy = copy.filter(card => card.id !== cardId);

      const moveToBack = before === "-1";

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertIndex = copy.findIndex(card => card.id === before);

        if (insertIndex === undefined) return;

        copy.splice(insertIndex, 0, cardToTransfer);
      }

      setCards(copy);
    }
  }

  return (
    <div className="flex flex-col w-[33%] h-full bg-dark-secondary rounded-xl">
      <div className="flex justify-between items-center rounded-t-xl p-4 bg-violet-900 select-none">
        <div className="tracking-wide text-lg font-bold">
          {title}
        </div>
        <span className="text-md">{filteredCards.length}</span>
      </div>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDragEnd}
        className={`flex flex-col px-3 h-full`}
      >
        {filteredCards.map((card) => (
          <Card
            key={card.id}
            card={card}
            handleDragStart={handleDragStart}
          />
        ))}
      </div>
    </div >
  );
}
