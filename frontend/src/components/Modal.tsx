import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from './Modal.module.css';

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
      className={`${styles.overlay} fade-up`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.modal}>
        <button
          onClick={onClose}
          className={styles.close}
        >
          ✕
        </button>
        <div className={styles.main}>
          {children}
        </div>
      </div>
    </div>,
    document.body // render outside root
  );
}
