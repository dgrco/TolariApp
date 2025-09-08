import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import React, { forwardRef, useState } from "react";
import { main } from "../../../wailsjs/go/models";
import { Task } from "../../types";

interface Props {
  task: Task;
}

export const TaskCard = (props: Props) => {
  const { task } = props;

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task
    }
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  if (isDragging) {
    return (
      <div
        key={`card-${task.id}`}
        ref={setNodeRef}
        style={style}
        className="flex h-[100px] items-center bg-neutral-700 break-all rounded-md border-2 border-secondary touch-none select-none cursor-grab text-transparent opacity-50"
      >
        {task.content}
      </div>
    )
  }

  return (
    <motion.div
      key={`card-${task.id}`}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex h-[100px] items-center bg-neutral-700 break-all rounded-md border border-neutral-600 touch-none select-none cursor-grab"
    >
      {task.content}
    </motion.div>
  )
};
