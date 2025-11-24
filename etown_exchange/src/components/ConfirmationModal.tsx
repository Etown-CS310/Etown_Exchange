import React from 'react';
import './styles/ConfirmationModal.css';

type ConfirmationModalProps = {
    isOpen: boolean;
    title: string;
    message: string;
    itemName?: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmButtonText?: string;
    cancelButtonText?: string;
    isLoading?: boolean
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    title,
    message,
    itemName,
    onConfirm,
    onCancel,
    confirmButtonText = 'Delete',
    cancelButtonText = 'Cancel',
    isLoading
}) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-icon">
                    <span>⚠️</span>
                </div>

                <h2 className="modal-title">{title}</h2>
                <p className="modal-message">{message}</p>

                {itemName && (
                    <p className="modal-item-name">{itemName}</p>
                )}
                <div className="modal-actions">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="cancel-btn"
                    >
                        {cancelButtonText}
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="confirm-btn"
                    >
                        {isLoading ? 'Deleting...' : confirmButtonText}
                    </button>
                </div>

            </div>
        </div>
    )

}

export default ConfirmationModal;