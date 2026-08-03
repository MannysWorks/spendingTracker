import { useState } from "react";
import "../css/HeroBanner.css";
import ModalForm from "./Modals/ModalForm";
import {
    AnimatePresence,
    motion,
    type Variants,
} from "framer-motion";
import buttonAddIcon from "../assets/add-entry-wood-button.webp";

type HeroBannerProps = {
    userName?: string;
    totalBalance?: number;
    percentageChange?: number;
};

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

function HeroBanner({
    totalBalance = 0,
    percentageChange = 0,
}: HeroBannerProps) {
    const [showModalForm, setShowModalForm] = useState(false);
    const [showBalance, setShowBalance] = useState(true);

    // TODO: Replace these mocked category totals with API data.
    const categories: CategoryCard[] = [
        {
            name: "Food & Drinks",
            amount: 843.24,
            className: "wallet-card--food",
        },
        {
            name: "Transportation",
            amount: 512.38,
            className: "wallet-card--transportation",
        },
        {
            name: "Shopping",
            amount: 1283.76,
            className: "wallet-card--shopping",
        },
    ];

    const formatCurrency = (amount: number): string =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);

    const isPositive = percentageChange >= 0;

    return (
        <>
            <section className="hero-banner" aria-label="Spending wallet summary">
                <div className="wallet-shell">
                    <div
                        className="wallet-cards"
                        aria-label="Spending categories"
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
                                    {formatCurrency(category.amount)}
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
                                <div className="wallet-balance__row">
                                    <span className="wallet-balance__amount">
                                        {showBalance
                                            ? formatCurrency(totalBalance)
                                            : "•••••••"}
                                    </span>

                                    <button
                                        type="button"
                                        className="balance-toggle"
                                        onClick={() =>
                                            setShowBalance(
                                                (current) => !current,
                                            )
                                        }
                                        aria-label={
                                            showBalance
                                                ? "Hide total balance"
                                                : "Show total balance"
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

                                <div className="wallet-change">
                                    <span
                                        className={`wallet-change__badge ${isPositive
                                            ? "wallet-change__badge--positive"
                                            : "wallet-change__badge--negative"
                                            }`}
                                    >
                                        {isPositive ? "+" : ""}
                                        {percentageChange.toFixed(2)}%
                                    </span>

                                    <span className="wallet-change__label">
                                        last day
                                    </span>
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
                    />
                )}
            </AnimatePresence>
        </>
    );
}

export default HeroBanner;