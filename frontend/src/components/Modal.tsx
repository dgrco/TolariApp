import React, { useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => any
}

export default function Modal({ children, onClose }: ModalProps) {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-dark-secondary text-base p-6 rounded-lg text-white shadow-xl w-80 flex flex-col relative">
        <button onClick={onClose} className="absolute top-2 right-2 border-none bg-transparent text-xl cursor-pointer text-white hover:opacity-70">
          ✕
        </button>
        <div className="flex flex-col gap-4 my-2 mx-3">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
