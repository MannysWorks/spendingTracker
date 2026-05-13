import type { ReactNode } from "react";

interface GenericModalProps {
    onClose: () => void;
    body: ReactNode;
    title?: string;
    onSave?: () => void;
}

function GenericModal({ onClose, body, title, onSave }: GenericModalProps) {
    return (
        <div className="modal fade show d-block" tabIndex={-1}>
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {body}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GenericModal;