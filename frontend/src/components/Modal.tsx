import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

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

  return (
    <motion.div
      key="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 bg-black/60 flex justify-center items-center"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ scale: 0.85 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.85 }}
        transition={{ duration: 0.15, ease: "easeInOut" }}
        className="bg-dark-secondary text-base p-6 rounded-lg text-white w-80 flex flex-col relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 border-none bg-transparent text-xl cursor-pointer text-white hover:opacity-70">
          ✕
        </button>
        <div className="flex flex-col gap-4 my-2 mx-3">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
