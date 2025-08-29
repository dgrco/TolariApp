import styles from "./Column.module.css";
import Card, { ICard } from "./Card";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDndMonitor, useDroppable } from "@dnd-kit/core";
import { useState } from "react";
import { IColumnValue } from "../../screens/board";

interface ColumnProps {
  id: string,
  column: IColumnValue,
  tasks: ICard[],
}

export default function Column({ id, column, tasks }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id });
  const [isOverColumn, setIsOverColumn] = useState(false);

  useDndMonitor({
    onDragOver(event) {
      if (!event.over) {
        setIsOverColumn(false);
        return;
      }
      const overId = event.over.id as string;

      setIsOverColumn(overId === id || tasks.some(t => t.id === overId));
    },
    onDragEnd() {
      setIsOverColumn(false);
    }
  });

  const style = {
    opacity: isOverColumn ? 0.85 : 1,
  };

  return (
    <SortableContext id={id} items={tasks} strategy={verticalListSortingStrategy}>
      <div ref={setNodeRef} style={style} className={styles.column}>
        <div className={styles.title}>
          {column.title}
        </div>
        <div className={styles.content}>
          {tasks.map((task) => (
            <Card key={task.id} id={task.id} content={task.content} />
          ))}
        </div>
      </div>
    </SortableContext>
  );
}
