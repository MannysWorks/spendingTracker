
interface ToastProps {
    message: string;
    onClose?: () => void;
    onDeleteEntry?: () => void;
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

export const ToastWithBtn = ({ message, onClose, onDeleteEntry }: ToastProps) => {
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
                <div className="mt-2 pt-2 border-top">
                    <button type="button" className="btn btn-primary btn-sm" onClick={onDeleteEntry}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Toast;