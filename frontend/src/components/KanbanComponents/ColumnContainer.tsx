import { TaskCard } from "./TaskCard";
import React, { useMemo, useRef, useState, forwardRef, CSSProperties } from "react";
import { useDroppable } from '@dnd-kit/react';
import { CollisionPriority } from '@dnd-kit/abstract';
import { Tasks } from "../../types";

interface Props {
  id: string;
  title: string;
  nChildren: number;
  children: React.ReactNode;
}

export default function ColumnContainer(props: Props) {
  const { id, title, nChildren, children } = props;

  const { isDropTarget, ref } = useDroppable({
    id,
    type: 'column',
    accept: 'task',
    collisionPriority: CollisionPriority.Low,
  });
  const style: CSSProperties | undefined = isDropTarget ? {
    opacity: 0.9,
  } : undefined;

  return (
    <div
      className="flex flex-col justify-start flex-shrink-0 flex-grow-0 basis-[calc((100%-4rem)/3)] rounded-xl"
    > {/* 100% - 4rem comes from wanting 3 columns shown by default with 2rem gaps each (=4rem) */}
      <div
        className="flex justify-between items-center rounded-t-xl p-4 bg-violet-900 select-none"
      >
        <div className="tracking-wide text-lg font-bold">
          {title}
        </div>
        <span className="text-md">{nChildren}</span>
      </div>
      <div
        ref={ref}
        style={style}
        className="flex flex-col bg-dark-secondary rounded-ee-xl rounded-es-xl transition-opacity max-h-full overflow-y-scroll">
        <div className="flex flex-col gap-3 px-8 py-10">
          {children}
        </div>
      </div>
    </div>
  );
}
