import { Link } from "react-router-dom";
import ColumnContainer from "../components/KanbanComponents/ColumnContainer";
import { Ref, useEffect, useMemo, useRef, useState } from "react";
import Modal from "../components/Modal";
import { main } from "../../wailsjs/go/models";
import { motion, AnimatePresence } from "framer-motion";
import { GetKanbanCards, GetKanbanColumns, GetKanbanColumnTitles, SaveAllKanbanData, SaveKanbanCard } from "../../wailsjs/go/main/App";
import { TaskCard } from "../components/KanbanComponents/TaskCard";
import { DragDropProvider } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';
import { Columns, ColumnTitles, Tasks } from "../types";
import { VariableSizeList as List } from 'react-window';

export default function Board() {
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [columns, setColumns] = useState<Columns>({});
  const [columnTitles, setColumnTitles] = useState<ColumnTitles>({});
  const [tasks, setTasks] = useState<Tasks>({});

  useEffect(() => {
    (async () => {
      // Load columns
      const columns = await GetKanbanColumns();
      setColumns(columns);

      // Load column titles
      const columnTitles = await GetKanbanColumnTitles();
      setColumnTitles(columnTitles);

      // Load cards
      const cards = await GetKanbanCards();
      setTasks(cards);

      setLoading(false);
    })();
  }, [])

  const saveData = (tasks: Tasks, columns: Columns, columnTitles: ColumnTitles) => {
    if (loading) return;

    (async () => {
      try {
        await SaveAllKanbanData(tasks, columns, columnTitles);
      } catch (err) {
        console.error(err);
      }
    })();
  }

  interface ColumnFindResult {
    columnId: string;
    taskIndex: number;
  }

  const columnFind = (taskId: string): ColumnFindResult | null => {
    const columnId = Object.keys(columns).find(colId => columns[colId].includes(taskId));
    if (!columnId) return null;
    const taskIndex = columns[columnId].findIndex(tid => tid === taskId);
    if (taskIndex === -1) return null;

    return { columnId, taskIndex }
  }

  const deleteCard = (taskId: string) => {
    const modifiedTasks = Object.fromEntries(Object.entries(tasks).filter(([tid, _]) => tid !== taskId));
    setTasks(modifiedTasks);

    const colFindRes = columnFind(taskId);
    if (colFindRes === null) return;

    const { columnId, taskIndex } = colFindRes;

    const modifiedColumns: Columns = {
      ...columns,
      [columnId]: [
        ...columns[columnId].slice(0, taskIndex),
        ...columns[columnId].slice(taskIndex + 1, columns[columnId].length),
      ]
    }

    setColumns(modifiedColumns);

    saveData(modifiedTasks, modifiedColumns, columnTitles);
  }

  const updateCard = (taskId: string, contentRef: React.RefObject<HTMLDivElement>) => {
    const updatedTaskFn = () => {
      if (!contentRef.current) return tasks;
      return {
        ...tasks,
        [taskId]: contentRef.current.innerText.trim(),
      }
    }

    const modifiedTasks = updatedTaskFn();

    setTasks(modifiedTasks);

    saveData(modifiedTasks, columns, columnTitles);
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
          <DragDropProvider
            onDragOver={(event) => {
              setColumns((prev) => move(prev, event));
            }}
            onDragEnd={(_) => {
              setColumns((prev) => {
                saveData(tasks, prev, columnTitles);
                return prev;
              });
            }}
          >
            <div className="flex flex-col max-h-screen">
              <div className="flex justify-between p-4">
                <Link to="/" className="px-3 py-2 rounded-full bg-dark-secondary text-white hover:bg-dark-secondary-hover transition-colors duration-200 select-none">
                  &#8592;
                </Link>
              </div>
              <div className="flex flex-1 gap-8 px-8 pb-4 overflow-y-auto">
                {Object.entries(columnTitles).map(([colId, title]) => {
                  return (
                    <ColumnContainer
                      key={colId}
                      id={colId}
                      nChildren={columns[colId].length}
                      title={title}
                    >
                      <>
                        {columns[colId].map((tid, i) => (
                          <TaskCard
                            key={tid}
                            id={tid}
                            content={tasks[tid]}
                            columnId={colId}
                            index={i}
                            onDelete={deleteCard}
                            onUpdate={updateCard}
                          />
                        ))}
                        <button
                          className="select-none appearance-none w-full border-2 border-primary rounded-md p-1 hover:bg-primary hover:border-primary text-md opacity-80 hover:opacity-100 transition-all"
                          onClick={async () => {
                            const newTaskId = await SaveKanbanCard("", colId);
                            setTasks((prevTasks) => {
                              return {
                                ...prevTasks,
                                [newTaskId]: "",
                              }
                            });
                            setColumns((prevCols) => {
                              return {
                                ...prevCols,
                                [colId]: [
                                  ...columns[colId],
                                  newTaskId,
                                ]
                              }
                            })
                          }}
                        >
                          + Add
                        </button>
                      </>
                    </ColumnContainer>
                  )
                })}
              </div>
            </div>
          </DragDropProvider>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
