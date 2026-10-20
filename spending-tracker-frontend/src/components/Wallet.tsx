import { useCallback, useEffect, useRef, useState } from "react";
import "../css/Wallet.css";
import ModalForm from "./Modals/ModalForm";
import {
    AnimatePresence,
    motion,
    type Variants,
} from "framer-motion";
import buttonAddIcon from "../assets/add-entry-wood-button.webp";
import { getEntries } from "../Services/EntryService";
import type { Entry } from "../interfaces/Entry";

type CategoryCard = {
    name: string;
    amount: number;
    className: string;
};

const cardVariants: Variants = {
    hidden: {
        y: 95,
        opacity: 0,
    },
    visible: (index: number) => ({
        y: 0,
        opacity: 1,
        transition: {
            // Reverse the stagger so the lowest card exits first:
            // Shopping -> Transportation -> Food & Drinks.
            delay: 0.25 + (2 - index) * 0.25,
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
};

function Wallet() {
    const [showModalForm, setShowModalForm] = useState(false);
    const [showBalance, setShowBalance] = useState(true);
    const [entries, setEntries] = useState<Entry[]>([]);
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
    const activeRequest = useRef<AbortController | null>(null);

    const loadWallet = useCallback((): Promise<void> => {
        activeRequest.current?.abort();
        const controller = new AbortController();
        activeRequest.current = controller;

        return getEntries(controller.signal).then(
            (loadedEntries) => {
                if (!controller.signal.aborted) {
                    setEntries(loadedEntries);
                    setStatus("ready");
                }
            },
            () => {
                if (!controller.signal.aborted) {
                    setStatus("error");
                }
            },
        );
    }, []);

    useEffect(() => {
        void loadWallet();
        return () => activeRequest.current?.abort();
    }, [loadWallet]);

    const refreshWallet = (): void => {
        setStatus("loading");
        void loadWallet();
    };

    const latestEntry = entries.at(-1);
    const previousEntry = entries.at(-2);
    const totalBalance = latestEntry?.totalAssets ?? 0;
    const percentageChange = Number((latestEntry?.percentChange ?? 0).toFixed(2));
    const hasComparison = status === "ready"
        && previousEntry !== undefined
        && previousEntry.totalAssets !== 0
        && Number.isFinite(latestEntry?.percentChange);
    const isReady = status === "ready";

    // These cards show spending for the latest recorded date.
    const categories: CategoryCard[] = [
        {
            name: "Food & Drinks",
            amount: (latestEntry?.grocery ?? 0) + (latestEntry?.fastFood ?? 0),
            className: "wallet-card--food",
        },
        {
            name: "Transportation",
            amount: latestEntry?.gas ?? 0,
            className: "wallet-card--transportation",
        },
        {
            name: "Shopping",
            amount: latestEntry?.shopping ?? 0,
            className: "wallet-card--shopping",
        },
    ];

    const formatCurrency = (amount: number): string =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);

    const changeVariant = percentageChange > 0
        ? "positive"
        : percentageChange < 0 ? "negative" : "neutral";

    const latestEntryDate = latestEntry
        ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium" })
            .format(new Date(`${latestEntry.date}T12:00:00`))
        : "";

    return (
        <>
            <section
                className="hero-banner"
                aria-label="Spending wallet summary"
                aria-busy={status === "loading"}
            >
                <div className="wallet-shell">
                    <div
                        className="wallet-cards"
                        aria-label="Spending categories for the latest entry"
                    >
                        {categories.map((category, index) => (
                            <motion.div
                                className={`wallet-card ${category.className}`}
                                key={category.name}
                                custom={index}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <span className="wallet-card__name">
                                    {category.name}
                                </span>

                                <span className="wallet-card__amount">
                                    {!showBalance ? "•••••" : isReady ? formatCurrency(category.amount) : "—"}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    <div className="wallet-pocket">
                        <div
                            className="wallet-stitching"
                            aria-hidden="true"
                        />

                        <div className="wallet-pocket__content">
                            <div className="wallet-balance">
                                <p className="wallet-balance__label">Total assets</p>
                                <div className="wallet-balance__row">
                                    <span className="wallet-balance__amount">
                                        {!showBalance
                                            ? "•••••••"
                                            : status === "loading"
                                                ? "Loading…"
                                                : isReady ? formatCurrency(totalBalance) : "—"}
                                    </span>

                                    <button
                                        type="button"
                                        className="balance-toggle"
                                        aria-pressed={!showBalance}
                                        onClick={() =>
                                            setShowBalance(
                                                (current) => !current,
                                            )
                                        }
                                        aria-label={
                                            showBalance
                                                ? "Hide wallet amounts"
                                                : "Show wallet amounts"
                                        }
                                    >
                                        {showBalance ? (
                                            <svg
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
                                                width="25"
                                                height="25"
                                            >
                                                <path
                                                    d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />

                                                <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="2.8"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
                                                width="25"
                                                height="25"
                                            >
                                                <path
                                                    d="m3 3 18 18"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                />

                                                <path
                                                    d="M10.6 6.2A10.4 10.4 0 0 1 12 6c6 0 9.5 6 9.5 6a15 15 0 0 1-2.3 3"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />

                                                <path
                                                    d="M6.3 7.2C3.9 9 2.5 12 2.5 12s3.5 6 9.5 6c1.2 0 2.3-.2 3.3-.6"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                {hasComparison && (
                                    <div className="wallet-change">
                                        <span
                                            className={`wallet-change__badge wallet-change__badge--${changeVariant}`}
                                            aria-label={showBalance
                                                ? `${percentageChange.toFixed(2)}% change versus previous entry`
                                                : "Percentage change hidden"}
                                        >
                                            {showBalance
                                                ? `${percentageChange > 0 ? "+" : ""}${percentageChange.toFixed(2)}%`
                                                : "••••"}
                                        </span>

                                        <span className="wallet-change__label">
                                            vs. previous entry
                                        </span>
                                    </div>
                                )}

                                <div className="wallet-summary__status" role="status">
                                    {status === "loading" ? "Loading your latest entry…"
                                        : status === "error" ? (
                                            <>
                                                Unable to load your wallet.{" "}
                                                <button type="button" onClick={refreshWallet}>
                                                    Retry
                                                </button>
                                            </>
                                        ) : latestEntry ? (
                                            <>
                                                Latest entry · <time dateTime={latestEntry.date}>{latestEntryDate}</time>
                                                {!previousEntry && " · First entry"}
                                                {previousEntry?.totalAssets === 0 && " · No percentage baseline"}
                                            </>
                                        ) : "Add your first entry to get started."}
                                </div>
                            </div>

                            <motion.button
                                type="button"
                                className="add-entry-button"
                                initial={{
                                    opacity: 0,
                                    scale: 0.8,
                                    rotate: -8,
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    rotate: 0,
                                    transition: {
                                        delay: 1.05,
                                        duration: 0.5,
                                        ease: [0.22, 1, 0.36, 1],
                                    },
                                }}
                                whileHover={{
                                    scale: 1.07,
                                    rotate: 3,
                                    y: -4,
                                }}
                                whileTap={{
                                    scale: 0.94,
                                    rotate: -2,
                                    y: 1,
                                }}
                                onClick={() => setShowModalForm(true)}
                                aria-label="Add a new spending entry"
                            >
                                <img
                                    src={buttonAddIcon}
                                    alt=""
                                    draggable={false}
                                />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </section>

            <AnimatePresence>
                {showModalForm && (
                    <ModalForm
                        key="modal-form"
                        onClose={() => setShowModalForm(false)}
                        onSaved={refreshWallet}
                    />
                )}
            </AnimatePresence>
        </>
    );
}

export default Wallet;
