import React from "react";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}

export default function Modal({ children, onClose, title }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl max-w-3xl w-full p-8 relative">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6">{title}</h2>
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-800 text-3xl font-bold"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
