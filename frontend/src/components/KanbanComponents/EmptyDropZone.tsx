import { useDroppable } from "@dnd-kit/core";

export default function EmptyDropZone({ columnId }: { columnId: string }) {
  const { setNodeRef, isOver } = useDroppable({ id: columnId });

  return (
    <div
      ref={setNodeRef}
      style={{
        minHeight: "4rem",
        border: "2px dashed #ccc",
        borderRadius: "0.5rem",
        background: isOver ? "#f0f0f0" : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#aaa",
        fontSize: "0.9rem",
      }}
    >
      Drop here
    </div>
  );
}
