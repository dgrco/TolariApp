import { Link } from "react-router-dom";
import Column from "../components/KanbanComponents/Column";
import { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import Card, { ICard } from "../components/KanbanComponents/Card";
import Modal from "../components/Modal";
import { main } from "../../wailsjs/go/models";
import { GetAllKanbanCards, GetAllKanbanColumns, SaveKanbanCard, SaveKanbanColumns } from "../../wailsjs/go/main/App";
import { createPortal } from "react-dom";

export interface IColumnValue {
  title: string;
  cardIds: string[];
}
type ColumnsType = Record<string, IColumnValue>;
const initialColumns: ColumnsType = {}

type CardsType = Record<string, string>;
const initialCards = {};

type DragItemType = { id: string; columnId: string };

export default function Board() {
  const [columns, setColumns] = useState<ColumnsType>(initialColumns);
  const [cards, setCards] = useState<CardsType>(initialCards);
  const [activeDragItem, setActiveDragItem] = useState<DragItemType | null>(null);
  const [showModal, setShowModal] = useState(false);

  // NOTE: this may be useful in the future (column re-ordering, etc.)
  const [columnOrder, setColumnOrder] = useState<string[]>(['column-1', 'column-2', 'column-3']);

  const [loading, setLoading] = useState(true);
  const newTask = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const columns = await GetAllKanbanColumns();
      const cards = await GetAllKanbanCards();
      const newCardEntries = Object.entries(cards).map(([k, v]) => {
        const newKey = `${k}`;
        return [newKey, v];
      })
      const newCards = Object.fromEntries(newCardEntries);

      const newColEntries = Object.entries(columns).map(([k, v]) => {
        const val = v as main.KanbanColumn;
        const newKey = `column-${k}`;
        return [newKey, { title: val['title'], cardIds: val['cardIds'] }];
      })
      const newColumns = Object.fromEntries(newColEntries);

      setColumns(newColumns);
      setCards(newCards);
      setLoading(false);
    })();

    // Ensure grabbing cursor clears on unmount
    return () => {
      document.body.classList.remove("dragging");
    };
  }, [])

  function findColumn(id: string) {
    if (id in columns) {
      return id;
    }
    return Object.keys(columns).find((key) => columns[key].cardIds.includes(id));
  }

  // Converts frontend column data type to a backend compatible type (just a digit)
  function parseColumns(columns: ColumnsType) {
    const parsedColumns: Record<number, main.KanbanColumn> = Object.fromEntries(
      Object.entries(columns).map(([k, v]) => {
        const columnIdParsed = parseInt(k.split('-')[1]);
        const cardIdsParsed = columns[k].cardIds.map((cardId) => parseInt(cardId));
        return [
          columnIdParsed,
          {
            "title": v.title,
            "cardIds": cardIdsParsed,
          } as main.KanbanColumn
        ]
      }));
    return parsedColumns;
  }

  const addCard = async () => {
    if (newTask.current) {
      const newCardContent = newTask.current.value;
      const newId = await SaveKanbanCard(newCardContent);
      setCards(prev => {
        return {
          ...prev,
          [newId.toString()]: newCardContent,
        }
      });
      setColumns(prev => {
        return {
          ...prev,
          'column-1': {
            ...prev['column-1'],
            cardIds: [
              ...prev['column-1'].cardIds,
              newId.toString(),
            ],
          }
        }
      });
    }
    setShowModal(false);
  }

  if (loading) {
    return <div className="" style={{ color: 'white' }}>Loading board…</div>;
  }

  return (
    <div className="flex flex-col h-screen pb-5">
      <div className="flex justify-between p-4">
        <Link to="/" className="px-3 py-2 rounded-full bg-dark-secondary text-white hover:bg-dark-secondary-hover transition-colors duration-200">
          &#8592;
        </Link>
        <button
          onClick={() => setShowModal(true)}
          className="h-10 w-16 text-xs font-semibold rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-85 transition-opacity ease duration-200"
        >
          + Add
        </button>
      </div>
      {showModal &&
        <Modal onClose={() => setShowModal(false)}>
          <span className="text-lg">Add Task</span>
          <input type="text" ref={newTask} className="p-2 rounded-md bg-dark-secondary-hover text-white border-2 border-gray-600 focus:outline-none focus:border-primary" />
          <button
            className="h-10 w-24 text-xs font-semibold rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-85 transition-opacity ease duration-200 mx-auto"
            onClick={addCard}
          >
            Add
          </button>
        </Modal>
      }
      <div className="flex flex-1 gap-8 mx-8">
        {
          columnOrder.map((columnId) => {
            const column = columns[columnId];
            const tasks = column.cardIds.map(cardId => ({
              id: cardId,
              content: cards[cardId],
            }));
            return (
              <Column key={columnId} column={column} id={columnId} tasks={tasks} />
            );
          })
        }
      </div>
    </div>
  );
}
