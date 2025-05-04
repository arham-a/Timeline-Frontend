"use client"
import { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
        style={{
          animation: isOpen ? 'fadeIn 0.3s ease-in-out' : 'fadeOut 0.3s ease-in-out'
        }}
      />
      <div 
        className="flex min-h-full items-center justify-center p-4 sm:p-6"
        style={{
          animation: isOpen ? 'slideIn 0.3s ease-in-out' : 'slideOut 0.3s ease-in-out'
        }}
      >
        <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-[var(--color-shadow)]">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[var(--color-border)]">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">{title}</h2>
            <button
              onClick={onClose}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors p-1 hover:bg-[var(--color-bg-purple-50)] rounded-full"
            >
              <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
          <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(20px); opacity: 0; }
        }

        @media (max-width: 640px) {
          .modal-content {
            margin: 0;
            border-radius: 0;
            min-height: 100vh;
          }
        }
      `}</style>
    </div>
  );
} 