import Card, { ICard } from "./Card";
import { useState } from "react";
import { IColumnValue } from "../../screens/board";

interface ColumnProps {
  id: string,
  column: IColumnValue,
  tasks: ICard[],
}

export default function Column({ id, column, tasks }: ColumnProps) {
  return (
    <div className="flex flex-col flex-1 w-full bg-dark-secondary rounded-xl pb-4 shadow-xl gap-4">
      <div className="font-bold w-full text-lg tracking-wide rounded-t-xl bg-violet-900 text-center p-4 select-none">
        {column.title}
      </div>
      <div className="flex flex-col gap-4 px-4">
        {tasks.map((task) => (
          <Card key={task.id} id={task.id} content={task.content} />
        ))}
      </div>
    </div>
  );
}
