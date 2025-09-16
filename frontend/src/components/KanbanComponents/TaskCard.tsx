import { useSortable } from '@dnd-kit/react/sortable';
import { motion, AnimatePresence } from "framer-motion";
import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { Tasks } from '../../types';

interface Props {
  id: string;
  content: string;
  columnId: string;
  index: number;
  onDelete: (tid: string) => void;
  onUpdate: (tid: string, contentRef: React.RefObject<HTMLDivElement>) => void;
}

const TaskCardComponent = (props: Props) => {
  const { id, content, columnId, index, onDelete, onUpdate } = props;

  const [hovered, setIsHovered] = useState(false);
  const [editMode, setEditMode] = useState(content === "");
  const [editableContent, setEditableContent] = useState(content);
  const contentRef = useRef<HTMLDivElement>(null);

  const { ref, isDragging } = useSortable({
    id,
    index,
    type: 'task',
    accept: 'task',
    group: columnId
  });

  const style: CSSProperties = {
    opacity: isDragging ? 0.9 : 1,
    willChange: 'transform, opacity',
  }

  useEffect(() => {
    if (editMode && contentRef.current) {
      contentRef.current.innerText = editableContent;
      contentRef.current.focus();
      // Place cursor at end
      const range = document.createRange();
      range.selectNodeContents(contentRef.current);
      range.collapse(false); // false -> cursor at the end
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }, [editMode]);

  if (editMode) {
    return (
      <div
        key={id}
        ref={ref}
        style={style}
        className="flex flex-1 p-4 items-center justify-center bg-neutral-700 break-all rounded-md border-2 border-secondary touch-none select-none cursor-grab transition-all"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence>
          {
            hovered &&
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ opacity: 0.85 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="cursor-pointer absolute top-1 right-1 bg-success p-1.5 rounded-lg"
              onClick={() => {
                // Save the card
                onUpdate(id, contentRef)
                setEditMode(false)
              }}
            >
              <CheckIcon />
            </motion.span>
          }
        </AnimatePresence>
        <div
          ref={contentRef}
          className="w-full"
          contentEditable
          onInput={() => {
            if (contentRef.current) {
              setEditableContent(contentRef.current.innerText);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              if (event.shiftKey) {
                return;
              }

              event.preventDefault();
              // Save the card
              onUpdate(id, contentRef)
              setEditMode(false);
            }
          }}
        />
      </div>
    )
  }

  return (
    <div
      key={id}
      ref={ref}
      style={style}
      className="flex p-4 items-center justify-center bg-neutral-700 break-all rounded-md border-2 border-neutral-600 touch-none select-none cursor-grab transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {
          hovered &&
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ opacity: 0.85 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="cursor-pointer absolute top-1 right-1 bg-secondary p-1.5 rounded-lg"
            onClick={() => {
              setEditMode(true)
            }}
          >
            <EditIcon />
          </motion.span>
        }
      </AnimatePresence>
      <div className="whitespace-pre-line">
        {content}
      </div>
      <AnimatePresence>
        {
          hovered &&
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ opacity: 0.85 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="cursor-pointer absolute top-1 left-1 bg-error p-1.5 rounded-lg"
            onClick={() => onDelete(id)}
          >
            <TrashIcon />
          </motion.span>
        }
      </AnimatePresence>
    </div>
  )
}

export const TaskCard = React.memo(TaskCardComponent);

const EditIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /><path d="m15 5 4 4" /></svg>
  )
}
const CheckIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5" /></svg>
  )
}

const TrashIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6" /><path d="M14 11v6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
  )
}
