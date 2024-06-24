import './styles/ConfirmationModal.css';

interface Props{
    isOpen: boolean,
    message: string,
    onConfirm: () => void,
    onCancel: () => void
}

function ConfirmationModal({ isOpen, message, onConfirm, onCancel }: Props) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="confirmation-modal">
            <div className="modal-content">
                <h2>{message}</h2>
                <div className="modal-buttons">
                    <button onClick={onConfirm} className="modal-delete">Delete</button>
                    <button onClick={onCancel} className="modal-cancel">Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;
