import { useEffect, useState } from "react";
import AssetSummary from "../AssetSummary";
import Table from "../Table";
import type { Entry } from "../../interfaces/Entry";
import ModalForm from "./ModalForm";
import Toast, { ToastWithBtn } from "../Toast";
import { AnimatePresence, motion } from "framer-motion";
import Pagination from "../Pagination";

import { deleteEntry, getEntries, handleResponse } from "../../Services/EntryService";

function Modal({ onClose, onRefresh }: { onClose: () => void; onRefresh: () => void; }) {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [reversedEntries, setreversedEntries] = useState<Entry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [preFilledFormData, setPreFilledFormData] = useState<Entry>();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

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
        const response = await deleteEntry(date);
        setShowToastForDelete(false);
        console.log("Delete response:", response);
        handleResponse(response, setShowToast, setToastMessage);
        onRefresh();
    }
    const [deletedEntryDate, setDeletedEntryDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 35;
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = reversedEntries.slice(indexOfFirstEntry, indexOfLastEntry);


    useEffect(() => {
        setIsLoading(true);
        getEntries()
            .then((entries) => {
                setEntries(entries);
                setreversedEntries([...entries].slice().reverse());
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load entries:", err);
                setIsLoading(false);
            });
    }, []);

    return <>
        <motion.div className="modal show d-block"
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.90 }}
            transition={{ duration: 0.2 }}>
            <div className="modal-dialog modal-fullscreen main-modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <div>
                            <h1 className="modal-title fs-3">Current Entries</h1>
                            <h5 className="modal-title fs-6 mb-0 text-secondary">Daily cashflow, spending, transfers, and total assets at a glance.</h5>
                        </div>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body">

                        <AssetSummary
                            totalAssetsChange={lastEntry?.percentChange}
                            totalAssets={lastEntry?.totalAssets}
                            endOfDayBal={lastEntry?.endOfDayBalance}
                            percentChange={lastEntry?.percentChange}
                            RobinHoodBal={lastEntry?.robinHood}
                            isLoading={isLoading} />

                        <Table
                            titles={titles}
                            entries={currentEntries}
                            isLoading={false}
                            getFormDataEntry={handlePreFilledFormData}
                            onEditClick={() => setShowModalFormForEdit(true)}
                            onDeleteClick={(entryDate: string) => {
                                setDeletedEntryDate(entryDate);
                                setShowToastForDelete(true);
                            }} />
                        <Pagination
                            entriesPerPage={entriesPerPage}
                            totalEntries={entries.length}
                            setCurrentPage={setCurrentPage}
                            currentPage={currentPage} />
                    </div>


                    {showModalFormForEdit && <ModalForm
                        onClose={() => {
                            setShowModalFormForEdit(false)
                            onRefresh();
                        }}
                        entry={preFilledFormData}
                    />}
                    {showToastForDelete && (
                        <div className="toast-container position-fixed top-0 start-50 translate-middle-x p-3" style={{ zIndex: 9999 }}>
                            <AnimatePresence>
                                <motion.div
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ToastWithBtn message={message}
                                        onClose={() => setShowToastForDelete(false)}
                                        onDeleteEntry={() => HandleDeleteEntry(deletedEntryDate)}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    )}
                    <AnimatePresence>
                        {showToast && (
                            <div className="toast-container position-fixed top-0 start-50 translate-middle-x p-3" data-bs-delay="5000" data-bs-animation="true" style={{ zIndex: 9999 }}>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Toast message={toastMessage} onClose={() => setShowToast(false)} />
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    </>
}
export default Modal;