import React from "react";

const ImageModal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-5xl w-full">
        <button
          className="absolute -top-12 right-0 text-white text-3xl font-bold hover:text-gray-300 bg-black bg-opacity-50 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
        <div className="bg-white rounded-lg p-2">
          <img
            src={imageUrl}
            alt="Event"
            className="w-full h-auto max-h-[85vh] object-contain rounded"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
