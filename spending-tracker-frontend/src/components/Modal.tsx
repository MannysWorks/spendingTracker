import { useEffect, useState } from "react";
import AssetSummary from "./AssetSummary";
import Table from "./Table";
import type { Entry } from "../interfaces/Entry";
import ModalForm from "./ModalForm";
import { ToastWithBtn } from "./Toast";
import { deleteEntry, handleResponse } from "../Services/EntryService";

const BASE_URL = 'http://localhost:8080/api/v1/spendingTracker'

function Modal({ onClose }: { onClose: () => void }) {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [preFilledFormData, setPreFilledFormData] = useState<Entry>();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    useEffect(() => {
        const fetchEntries = async () => {
            setIsLoading(true);
            const response = await fetch(`${BASE_URL}/all`);
            const entries = await response.json() as Entry[];
            setEntries(entries);
            setIsLoading(false);
        }
        fetchEntries();
    }, [])

    const titles = [
        "Date",
        "Income",
        "Start of Day Balance",
        "Cold Cash",
        "Grocery",
        "Fast Food",
        "Bills",
        "Subscriptions",
        "Gas",
        "Shopping",
        "Miscellaneous",
        "Robin Hood Transfer",
        "End of Day Balance",
        "Robin Hood",
        "Total Assets",
        "Percent Change"
    ];

    const lastEntry = entries[entries.length - 1];
    const handlePreFilledFormData = (entry: Entry) => {
        setPreFilledFormData(entry);
    }
    const [showModalFormForEdit, setShowModalFormForEdit] = useState(false);
    const [showToastForDelete, setShowToastForDelete] = useState(false);
    const message = "Are you sure you want to delete this entry? This action cannot be undone."
    const HandleDeleteEntry = async (date: string) => {
        const response = deleteEntry(date);
        handleResponse(response, setShowToast, setToastMessage);
        setShowToastForDelete(false);
    }

    return <>
        <div className="modal fade show d-block" tabIndex={-1}>
            <div className="modal-dialog modal-fullscreen">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">Current Entries</h1>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <AssetSummary
                            totalAssets={lastEntry?.totalAssets}
                            endOfDayBal={lastEntry?.endOfDayBalance}
                            percentChange={lastEntry?.percentChange}
                            RobinHoodBal={lastEntry?.robinHood}
                            isLoading={isLoading} />

                        <Table
                            titles={titles}
                            entries={entries}
                            getFormDataEntry={handlePreFilledFormData}
                            onEditClick={() => setShowModalFormForEdit(true)}
                            onDeleteClick={(entry: Entry) => {
                                setPreFilledFormData(entry);
                                setShowToastForDelete(true);
                            }} />
                    </div>
                    {showModalFormForEdit && <ModalForm
                        onClose={() => setShowModalFormForEdit(false)}
                        entry={preFilledFormData}
                    />}
                    {showToastForDelete && (
                        <div className="toast-container position-fixed top-0 start-50 translate-middle-x p-3" style={{ zIndex: 9999 }}>
                            <ToastWithBtn message={message} onClose={() => setShowToastForDelete(false)} onDeleteEntry={() => HandleDeleteEntry(preFilledFormData?.date || '')} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    </>
}
export default Modal;