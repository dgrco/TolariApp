import { Link } from "react-router-dom";
import ColumnContainer from "../components/KanbanComponents/ColumnContainer";
import { useEffect, useMemo, useRef, useState } from "react";
import Modal from "../components/Modal";
import { main } from "../../wailsjs/go/models";
import { motion, AnimatePresence } from "framer-motion";
import { Column, Task } from "../types";
import { closestCorners, DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { GetKanbanCards, GetKanbanColumns } from "../../wailsjs/go/main/App";
import { TaskCard } from "../components/KanbanComponents/TaskCard";

export default function Board() {
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [columns, setColumns] = useState<Column[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const columnIds = useMemo(() => columns.map(col => col.id), [columns]);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // 3 px
      }
    })
  )

  useEffect(() => {
    (async () => {
      // Load columns
      const columns = await GetKanbanColumns();
      setColumns(columns);

      // Load cards
      const cards = await GetKanbanCards();
      setTasks(cards);

      setLoading(false);
    })();
  }, [])

  const addCard = async () => {
  }

  function moveItem<T>(items: T[], from: number, to: number): T[] {
    const updated = [...items];
    console.log("MOVE FROM " + from + " to " + to)
    console.log("PRIOR: ", [...updated])
    const [movedItem] = updated.splice(from, 1);
    console.log("SPLICE: ", movedItem, [...updated])
    const adjustedTo = from < to ? to - 1 : to;
    updated.splice(adjustedTo, 0, movedItem);
    console.log("AFTER: ", [...updated])
    return updated;
  }

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  const onDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (active.data.current?.type === "Column") {
      setColumns(columns => {
        const activeColumnIndex = columns.findIndex(col => col.id === activeId);
        const overColumnIndex = columns.findIndex(col => col.id === overId);

        return moveItem(columns, activeColumnIndex, overColumnIndex);
      })
    }
  }

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Dropping a task over another task
    if (isActiveATask && isOverATask) {
      setTasks(tasks => {
        const activeIndex = tasks.findIndex(task => task.id === active.id);
        const overIndex = tasks.findIndex(task => task.id === over.id);

        tasks[activeIndex].columnId = tasks[overIndex].columnId;

        return moveItem(tasks, activeIndex, overIndex);
      })
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Dropping a task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks(tasks => {
        const activeIndex = tasks.findIndex(task => task.id === active.id);

        tasks[activeIndex].columnId = overId as string;

        return moveItem(tasks, activeIndex, activeIndex);
      })
    }

  }

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={
            // Let user know the board is loading if it takes awhile (`delay` in seconds).
            { opacity: 1, scale: 1, transition: { delay: 0.2 } }
          }
          exit={{ opacity: 0 }}
          className="flex w-screen h-screen justify-center items-center"
        >
          <span className="text-xl">
            Loading board…
          </span>
        </motion.div>
      ) : (
        <motion.div
          key="board"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex flex-col h-screen">
            <div className="flex justify-between p-4">
              <Link to="/" className="px-3 py-2 rounded-full bg-dark-secondary text-white hover:bg-dark-secondary-hover transition-colors duration-200 select-none">
                &#8592;
              </Link>
            </div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragOver={onDragOver}
            >
              <div className="flex flex-1 gap-8 px-8 overflow-x-auto">
                <SortableContext items={columnIds}>
                  {/* Render columns */}
                  {columns.map(col => (
                    <ColumnContainer
                      key={col.id}
                      column={col}
                      tasks={tasks.filter(task => task.columnId === col.id)}
                    />
                  ))}
                </SortableContext>
              </div>
              {createPortal(
                <DragOverlay>
                  {activeColumn && (
                    <ColumnContainer
                      column={activeColumn}
                      tasks={tasks.filter(task => task.columnId === activeColumn.id)}
                    />
                  )}
                  {
                    activeTask && <TaskCard task={activeTask} />
                  }
                </DragOverlay>,
                document.body
              )}
            </DndContext>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
