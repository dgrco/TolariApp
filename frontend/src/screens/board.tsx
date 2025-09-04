import { Link } from "react-router-dom";
import Column from "../components/KanbanComponents/Column";
import { useEffect, useRef, useState } from "react";
import Modal from "../components/Modal";
import { main } from "../../wailsjs/go/models";
import { GetAllKanbanCards, PushAndSaveKanbanCard } from "../../wailsjs/go/main/App";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../components/KanbanComponents/Card";

export default function Board() {
  const [cards, setCards] = useState<main.KanbanCard[]>([]);
  const [showModal, setShowModal] = useState(false);

  const columns = [{ id: 'todo', title: "To-Do" }, { id: 'in_progress', title: "In Progress" }, { id: 'done', title: "Done" }];

  const [loading, setLoading] = useState(true);
  const newTask = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const cardsData = await GetAllKanbanCards();

      setCards(cardsData);
      setLoading(false);
    })();
  }, [])

  const addCard = async () => {
    if (newTask.current) {
      const newCardContent = newTask.current.value;
      const newCardId = await PushAndSaveKanbanCard(newCardContent, 'todo');
      setCards([
        ...cards,
        main.KanbanCard.createFrom(
          { id: newCardId, title: newCardContent, columnId: 'todo' }
        )
      ]);
    }
    setShowModal(false);
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
          <div className="flex flex-col h-screen pb-5 overflow-scroll">
            <div className="flex justify-between p-4">
              <Link to="/" className="px-3 py-2 rounded-full bg-dark-secondary text-white hover:bg-dark-secondary-hover transition-colors duration-200 select-none">
                &#8592;
              </Link>
              <button
                onClick={() => setShowModal(true)}
                className="h-10 w-16 text-xs font-semibold rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-85 transition-opacity ease duration-200 select-none"
              >
                + Add
              </button>
            </div>
            <AnimatePresence>
              {showModal &&
                <Modal onClose={() => setShowModal(false)}>
                  <span className="text-lg">Add Task</span>
                  <input autoFocus type="text" ref={newTask} className="p-2 rounded-md bg-dark-secondary-hover text-white border-2 border-gray-600 focus:outline-none focus:border-primary" />
                  <button
                    className="h-10 w-24 text-xs font-semibold rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-85 transition-opacity ease duration-200 mx-auto select-none"
                    onClick={addCard}
                  >
                    Add
                  </button>
                </Modal>
              }
            </AnimatePresence>
            <div
              className="flex flex-1 gap-8 mx-8"
            >
              {columns.map((column) => (
                <Column
                  key={column.id}
                  id={column.id}
                  title={column.title}
                  setCards={setCards}
                  cards={cards}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
