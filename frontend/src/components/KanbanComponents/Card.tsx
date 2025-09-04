import { motion } from "framer-motion";
import React, { useState } from "react";
import { main } from "../../../wailsjs/go/models";
import { useDragContext } from "../../contexts/DragContext";

interface ICardProps {
  card: main.KanbanCard;
  handleDragStart: (e: DragEvent, card: main.KanbanCard) => void;
}

export const Card = React.memo(({ card, handleDragStart }: ICardProps) => {
  return (
    <>
      <DropIndicator beforeId={card.id} columnId={card.columnId} />
      <motion.div
        key={`card-${card.id}`}
        layout
        layoutId={card.id}
        draggable
        onDragStart={(e: DragEvent) => handleDragStart(e, card)}
        className="p-4 items-center bg-neutral-700 break-all rounded-xl border border-neutral-600 touch-none select-none"
      >
        {card.title}
      </motion.div>
    </>
  )
});

export const DropIndicator = React.memo(({ beforeId, columnId }: { beforeId: string, columnId: string }) => {
  return (
    <motion.div
      key={`indicator-${columnId}-${beforeId}`}
      // initial={{ opacity: 0, height: 0 }}
      // animate={{ opacity: active ? 1 : 0, height: active ? 12 : 0 }}
      data-before={beforeId || "-1"}
      data-column-id={columnId}
      className="my-[0.2rem] h-[0.1rem] p-0 w-full bg-primary opacity-0"
    />
  )
});
