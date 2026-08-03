import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

import AssetSummary from "../components/AssetSummary";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import Toast, {
    ToastWithBtn,
} from "../components/Toast";
import ModalForm from "../components/Modals/ModalForm";

import type { Entry } from "../interfaces/Entry";

import {
    deleteEntry,
    getEntries,
    handleResponse,
} from "../Services/EntryService";

import "../css/EntriesPage.css";

const tableTitles = [
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
    "Percent Change",
];

const DELETE_MESSAGE =
    "Are you sure you want to delete this entry? This action cannot be undone.";

function EntriesPage() {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedEntry, setSelectedEntry] =
        useState<Entry>();
    const [showEditForm, setShowEditForm] =
        useState(false);

    const [showToast, setShowToast] =
        useState(false);
    const [toastMessage, setToastMessage] =
        useState("");

    const [showDeleteToast, setShowDeleteToast] =
        useState(false);
    const [deletedEntryDate, setDeletedEntryDate] =
        useState("");

    const [currentPage, setCurrentPage] =
        useState(1);

    const entriesPerPage = 35;

    const loadEntries = useCallback(async (): Promise<void> => {
        try {
            setIsLoading(true);

            const loadedEntries = await getEntries();
            setEntries(loadedEntries);
        } catch (error) {
            console.error(
                "Failed to load entries:",
                error,
            );

            setToastMessage(
                "Unable to load your entries.",
            );
            setShowToast(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadEntries();
    }, [loadEntries]);

    const reversedEntries = useMemo(
        () => [...entries].reverse(),
        [entries],
    );

    const lastEntry =
        entries.length > 0
            ? entries[entries.length - 1]
            : undefined;

    const indexOfLastEntry =
        currentPage * entriesPerPage;
    const indexOfFirstEntry =
        indexOfLastEntry - entriesPerPage;

    const currentEntries = reversedEntries.slice(
        indexOfFirstEntry,
        indexOfLastEntry,
    );

    useEffect(() => {
        const totalPages = Math.max(
            1,
            Math.ceil(entries.length / entriesPerPage),
        );

        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, entries.length]);

    const handleEditClick = (
        entry: Entry,
    ): void => {
        setSelectedEntry(entry);
        setShowEditForm(true);
    };

    const requestDelete = (
        entryDate: string,
    ): void => {
        setDeletedEntryDate(entryDate);
        setShowDeleteToast(true);
    };

    const handleDeleteEntry =
        async (): Promise<void> => {
            const response = await deleteEntry(
                deletedEntryDate,
            );

            setShowDeleteToast(false);

            handleResponse(
                response,
                setShowToast,
                setToastMessage,
            );

            await loadEntries();
        };

    const closeEditForm = async (): Promise<void> => {
        setShowEditForm(false);
        setSelectedEntry(undefined);
        await loadEntries();
    };

    return (
        <motion.section
            className="entries-page"
            initial={{
                opacity: 0,
                y: 12,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            exit={{
                opacity: 0,
                y: -8,
            }}
            transition={{
                duration: 0.24,
                ease: "easeOut",
            }}
        >
            <div className="entries-page__heading">
                <div>
                    <p className="entries-page__eyebrow">
                        COMPLETE HISTORY
                    </p>

                    <h1>Current Entries</h1>

                    <p className="entries-page__subtitle">
                        Daily cashflow, spending,
                        transfers, and total assets at
                        a glance.
                    </p>
                </div>

                <button
                    type="button"
                    className="entries-page__refresh"
                    onClick={() => void loadEntries()}
                    disabled={isLoading}
                >
                    {isLoading
                        ? "Refreshing..."
                        : "Refresh"}
                </button>
            </div>

            <div className="entries-page__summary">
                <AssetSummary
                    totalAssetsChange={
                        lastEntry?.percentChange
                    }
                    totalAssets={
                        lastEntry?.totalAssets
                    }
                    endOfDayBal={
                        lastEntry?.endOfDayBalance
                    }
                    percentChange={
                        lastEntry?.percentChange
                    }
                    RobinHoodBal={
                        lastEntry?.robinHood
                    }
                    isLoading={isLoading}
                />
            </div>

            <div className="entries-page__table-card">
                <div className="entries-page__table-header">
                    <div>
                        <h2>Transaction Ledger</h2>
                        <p>
                            {entries.length} total{" "}
                            {entries.length === 1
                                ? "entry"
                                : "entries"}
                        </p>
                    </div>
                </div>

                <div className="entries-page__table-scroll">
                    <Table
                        titles={tableTitles}
                        entries={currentEntries}
                        isLoading={isLoading}
                        getFormDataEntry={
                            handleEditClick
                        }
                        onEditClick={() => {
                            if (selectedEntry) {
                                setShowEditForm(true);
                            }
                        }}
                        onDeleteClick={requestDelete}
                    />
                </div>

                <div className="entries-page__pagination">
                    <Pagination
                        entriesPerPage={entriesPerPage}
                        totalEntries={entries.length}
                        setCurrentPage={setCurrentPage}
                        currentPage={currentPage}
                    />
                </div>
            </div>

            <AnimatePresence>
                {showEditForm && selectedEntry && (
                    <ModalForm
                        key={selectedEntry.date}
                        onClose={() =>
                            void closeEditForm()
                        }
                        entry={selectedEntry}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showDeleteToast && (
                    <div className="entries-page__toast">
                        <motion.div
                            drag="x"
                            dragConstraints={{
                                left: 0,
                                right: 0,
                            }}
                            initial={{
                                opacity: 0,
                                y: -18,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                y: -18,
                            }}
                            transition={{
                                duration: 0.25,
                            }}
                        >
                            <ToastWithBtn
                                message={DELETE_MESSAGE}
                                onClose={() =>
                                    setShowDeleteToast(
                                        false,
                                    )
                                }
                                onDeleteEntry={() =>
                                    void handleDeleteEntry()
                                }
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showToast && (
                    <div className="entries-page__toast">
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: -18,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                y: -18,
                            }}
                            transition={{
                                duration: 0.25,
                            }}
                        >
                            <Toast
                                message={toastMessage}
                                onClose={() =>
                                    setShowToast(false)
                                }
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.section>
    );
}

export default EntriesPage;