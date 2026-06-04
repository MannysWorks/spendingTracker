import { motion } from "framer-motion";
import type { ReactNode } from "react";
import '../../css/GenericModal.css'

interface GenericModalProps {
    onClose: () => void;
    body: ReactNode;
    title?: string;
    onSave?: () => void;
}

function GenericModal({ onClose, body, title }: GenericModalProps) {
    return (
        <motion.div
            className="modal show d-block"
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
        >
            <div className="modal-dialog modal-dialog-centered">
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
        </motion.div>
    );
}

export default GenericModal;