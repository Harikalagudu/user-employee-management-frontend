import React from 'react';

/**
 * A reusable modal component.
 * @param {boolean} isOpen - Whether the modal is open.
 * @param {function} onClose - Function to close the modal.
 * @param {React.ReactNode} children - The content to display inside the modal.
 */
const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md mx-4 md:mx-0 rounded-xl shadow-lg p-6 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
                    aria-label="Close Modal"
                >
                    &times;
                </button>

                {/* Modal Content */}
                <div>{children}</div>
            </div>
        </div>
    );
};

export default Modal;
