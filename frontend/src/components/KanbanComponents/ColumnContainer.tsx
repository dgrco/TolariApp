import { TaskCard } from "./TaskCard";
import { main } from "../../../wailsjs/go/models";
import React, { useMemo, useRef, useState, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SaveAllKanbanData } from "../../../wailsjs/go/main/App";
import { Column, Task } from "../../types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  column: Column;
  tasks: Task[];
}

export default function ColumnContainer(props: Props) {
  const { column, tasks } = props;

  const taskIds = useMemo(() => {
    return tasks.map(task => task.id)
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column
    }
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex flex-col flex-shrink-0 flex-grow-0 basis-[calc((100%-4rem)/3)] h-full rounded-xl pb-8"
      >
        <div className="flex flex-col px-4 pt-4 h-full bg-dark-secondary opacity-50 border-2 border-secondary rounded-t-xl rounded-b-xl">
        </div>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col flex-shrink-0 flex-grow-0 basis-[calc((100%-4rem)/3)] h-full rounded-xl"
    > {/* 100% - 4rem comes from wanting 3 columns shown by default with 2rem gaps each (=4rem) */}
      <div
        {...attributes}
        {...listeners}
        className="flex justify-between items-center rounded-t-xl p-4 bg-violet-900 select-none"
      >
        <div className="tracking-wide text-lg font-bold">
          {column.title}
        </div>
        <span className="text-md">{}</span>
      </div>
      <div className="h-full pb-8">
        <div className="flex flex-col gap-6 px-4 pt-4 h-full bg-dark-secondary rounded-ee-xl rounded-es-xl">
          <SortableContext items={taskIds}>
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
              />
            ))}
          </SortableContext>
        </div>
      </div>
    </div>
  );
}
