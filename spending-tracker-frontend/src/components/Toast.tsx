
interface ToastProps {
    message: string;
    onClose?: () => void;
    onDeleteEntry?: () => void;
    setEntryDeleted?: (value: boolean) => void;
}

export const Toast = ({ message, onClose }: ToastProps) => {
    return (
        <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
                <strong className="me-auto">Notification</strong>
                <button
                    type="button"
                    className="btn-close"
                    onClick={onClose}
                />
            </div>
            <div className="toast-body">
                {message}
            </div>
        </div>
    )
}

export const ToastWithBtn = ({ message, onClose, onDeleteEntry, setEntryDeleted }: ToastProps) => {
    return (
        <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
                <strong className="me-auto">Notification</strong>
                <button
                    type="button"
                    className="btn-close"
                    onClick={onClose}
                />
            </div>
            <div className="toast-body">
                {message}
                <div className="mt-2 pt-2 border-top d-flex justify-content-center">
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => {
                        onDeleteEntry?.();
                        setEntryDeleted?.(true);
                    }}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Toast;