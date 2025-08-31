import { Link } from "react-router-dom";
import styles from "./board.module.css";
import Column from "../components/KanbanComponents/Column";
import { useEffect, useRef, useState } from "react";
import { closestCorners, DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import invariant from "tiny-invariant";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
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

  // Define sensors to detect drag operations (e.g., pointer for mouse/touch, keyboard for accessibility).
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    invariant(active);
    const activeId = active.id as string;
    const activeColumn = findColumn(activeId);
    if (activeColumn) {
      setActiveDragItem({ id: activeId, columnId: activeColumn });
    } else {
      console.error("Unable to find the active column")
    }
    document.body.classList.add("dragging")
  }

  function moveItemBetweenColumns(
    prev: ColumnsType,
    activeId: string,
    overId: string
  ): ColumnsType {
    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);

    if (!activeColumn || !overColumn) return prev;

    const activeItems = prev[activeColumn].cardIds;
    const overItems = prev[overColumn].cardIds;

    const activeIndex = activeItems.indexOf(activeId);
    const overIndex = overItems.indexOf(overId);

    // Dragging into same column
    if (activeColumn === overColumn) {
      if (activeIndex !== overIndex) {
        return {
          ...prev,
          [overColumn]: {
            ...columns[overColumn],
            cardIds: arrayMove(overItems, activeIndex, overIndex),
          }
        };
      }
      return prev;
    }

    // Dragging into another column
    const newIndexInOverColumn = overIndex !== -1 ? overIndex : overItems.length;

    return {
      ...prev,
      [activeColumn]: {
        ...columns[activeColumn],
        cardIds: [
          ...activeItems.slice(0, activeIndex),
          ...activeItems.slice(activeIndex + 1),
        ],
      },
      [overColumn]: {
        ...columns[overColumn],
        cardIds: [
          ...overItems.slice(0, newIndexInOverColumn),
          activeId,
          ...overItems.slice(newIndexInOverColumn),
        ],
      },
    };
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    setColumns(prev => moveItemBetweenColumns(prev, activeId, overId));
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Update the local state in memory, and save this new state to disk.
    setColumns(prev => {
      // NOTE: this next line seems redundant, but it bugs out without it
      const next = moveItemBetweenColumns(prev, activeId, overId);

      SaveKanbanColumns(parseColumns(next)).catch(console.error)

      return next;
    });

    document.body.classList.remove("dragging")
    setActiveDragItem(null);
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
    return <div className="fade-up" style={{ color: 'white' }}>Loading board…</div>;
  }

  return (
    <div id={styles.plan} className="fade-up">
      <div id={styles.topBar}>
        <Link to="/" className={`${styles.btn} ${styles.btnSecondaryBg} ${styles.iconBtn}`}>
          🠔
        </Link>
        <button
          onClick={() => setShowModal(true)}
          className={`${styles.btn} ${styles.btnPrimaryGrad}`}
        >
          +
          <span style={{ marginLeft: '0.2rem' }}>Add</span>
        </button>
      </div>
      {showModal &&
        <Modal onClose={() => setShowModal(false)}>
          <span>Add Task</span>
          <input type="text" ref={newTask} />
          <button
            className={`${styles.btn} ${styles.btnPrimaryGrad}`}
            onClick={addCard}
          >
            Add
          </button>
        </Modal>
      }
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={() => document.body.classList.remove("dragging")}
      >
        <div className={styles.columns}>
          {
            columnOrder.map((columnId) => {
              const column = columns[columnId];
              const tasks: ICard[] = column.cardIds.map(cardId => {
                return {
                  id: cardId,
                  content: cards[cardId],
                }
              });
              return (
                <Column key={columnId} column={column} id={columnId} tasks={tasks} />
              );
            })
          }
        </div>
        {
          createPortal(
            <DragOverlay>
              {activeDragItem ?
                <Card id={activeDragItem.id} content={cards[activeDragItem.id]} />
                : null
              }
            </DragOverlay>,
            document.body
          )
        }
      </DndContext>
    </div>
  )
}
