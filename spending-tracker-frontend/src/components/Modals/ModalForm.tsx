import type { Entry } from "../../interfaces/Entry";
import GenericModal from "./GenericModal";
import {
    Controller,
    useForm,
} from "react-hook-form";
import { useState } from "react";
import Toast from "../Toast";
import {
    AnimatePresence,
    motion,
} from "framer-motion";
import DatePicker from "react-datepicker";
import { parseISO } from "date-fns";

import "react-datepicker/dist/react-datepicker.css";
import "../../css/ModalForm.css";

import {
    modalFormFields,
    type FieldName,
} from "../../interfaces/ModalFormFields";
import {
    createEntrySubmitHandler,
    formatDateToString,
} from "../../Services/ModalFormService";

interface ModalFormProps {
    onClose: () => void;
    entry?: Entry;
}

function ModalForm({
    onClose,
    entry,
}: ModalFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<Entry>({
        defaultValues: entry,
    });

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [index, setIndex] = useState(0);

    const currentField = modalFormFields[index];
    const currentError = errors[
        currentField.name as FieldName
    ];
    const isDateField = currentField.name === "date";
    const isFirstField = index === 0;
    const isLastField =
        index === modalFormFields.length - 1;

    const onSubmit = createEntrySubmitHandler({
        entry,
        setShowToast,
        setToastMessage,
    });

    const goPrevious = (): void => {
        setIndex((currentIndex) =>
            Math.max(0, currentIndex - 1),
        );
    };

    const goNext = (): void => {
        setIndex((currentIndex) =>
            Math.min(
                modalFormFields.length - 1,
                currentIndex + 1,
            ),
        );
    };

    return (
        <>
            <GenericModal
                title=""
                onClose={onClose}
                body={
                    <div className="entry-modal">
                        <div className="entry-modal__topline">
                            <span className="entry-modal__mode">
                                {entry
                                    ? "EDIT ENTRY"
                                    : "NEW ENTRY"}
                            </span>

                            <span className="entry-modal__count">
                                {String(index + 1).padStart(2, "0")}
                                {" / "}
                                {String(
                                    modalFormFields.length,
                                ).padStart(2, "0")}
                            </span>
                        </div>

                        <div className="entry-modal__progress-track">
                            <motion.div
                                className="entry-modal__progress-value"
                                initial={false}
                                animate={{
                                    width: `${((index + 1) /
                                        modalFormFields.length) *
                                        100
                                        }%`,
                                }}
                                transition={{
                                    duration: 0.25,
                                    ease: "easeOut",
                                }}
                            />
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentField.name}
                                className="entry-modal__step"
                                initial={{
                                    opacity: 0,
                                    x: 16,
                                }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                }}
                                exit={{
                                    opacity: 0,
                                    x: -12,
                                }}
                                transition={{
                                    duration: 0.18,
                                    ease: "easeOut",
                                }}
                            >
                                <header className="entry-modal__header">
                                    <p className="entry-modal__eyebrow">
                                        SPENDING TRACKER
                                    </p>

                                    <h2 className="entry-modal__title">
                                        {currentField.label}
                                    </h2>

                                    <p className="entry-modal__description">
                                        {currentField.description}
                                    </p>
                                </header>

                                <form
                                    className="entry-modal__form"
                                    onSubmit={handleSubmit(
                                        onSubmit,
                                    )}
                                >
                                    <div className="entry-modal__field">
                                        <label
                                            className="entry-modal__field-label"
                                            htmlFor={
                                                currentField.name
                                            }
                                        >
                                            {currentField.label}
                                        </label>

                                        {isDateField ? (
                                            <Controller
                                                name="date"
                                                control={control}
                                                render={({
                                                    field,
                                                }) => (
                                                    <div className="entry-modal__date-wrapper">
                                                        <DatePicker
                                                            id="date"
                                                            selected={
                                                                field.value
                                                                    ? parseISO(
                                                                        field.value as string,
                                                                    )
                                                                    : null
                                                            }
                                                            onChange={(
                                                                date: Date | null,
                                                            ) => {
                                                                field.onChange(
                                                                    date
                                                                        ? formatDateToString(
                                                                            date,
                                                                        )
                                                                        : "",
                                                                );
                                                            }}
                                                            dateFormat="yyyy-MM-dd"
                                                            className={`entry-modal__input ${errors.date
                                                                ? "entry-modal__input--invalid"
                                                                : ""
                                                                }`}
                                                            placeholderText="YYYY-MM-DD"
                                                            isClearable
                                                        />

                                                        {errors.date && (
                                                            <span className="entry-modal__error">
                                                                {String(
                                                                    errors
                                                                        .date
                                                                        .message ??
                                                                    "Date is required",
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            />
                                        ) : (
                                            <>
                                                <div className="entry-modal__input-wrapper">
                                                    <span
                                                        className="entry-modal__currency"
                                                        aria-hidden="true"
                                                    >
                                                        $
                                                    </span>

                                                    <input
                                                        {...register(
                                                            currentField.name,
                                                            currentField.rules,
                                                        )}
                                                        id={
                                                            currentField.name
                                                        }
                                                        type={
                                                            currentField.type
                                                        }
                                                        inputMode="decimal"
                                                        step="0.01"
                                                        min="0"
                                                        className={`entry-modal__input entry-modal__input--currency ${currentError
                                                            ? "entry-modal__input--invalid"
                                                            : ""
                                                            }`}
                                                        placeholder={
                                                            currentField.placeholder
                                                        }
                                                    />
                                                </div>

                                                {currentError && (
                                                    <span className="entry-modal__error">
                                                        {String(
                                                            currentError.message ??
                                                            "This field is required",
                                                        )}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    <div className="entry-modal__actions">
                                        <button
                                            type="button"
                                            onClick={
                                                goPrevious
                                            }
                                            disabled={
                                                isFirstField
                                            }
                                            className="entry-modal__button entry-modal__button--secondary"
                                        >
                                            Previous
                                        </button>

                                        {!isLastField ? (
                                            <button
                                                type="button"
                                                onClick={
                                                    goNext
                                                }
                                                className="entry-modal__button entry-modal__button--primary"
                                            >
                                                Next
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                className="entry-modal__button entry-modal__button--primary"
                                            >
                                                {entry
                                                    ? "Update Entry"
                                                    : "Add Entry"}
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                }
            />

            <AnimatePresence>
                {showToast && (
                    <div
                        className="toast-container position-fixed top-0 start-50 translate-middle-x p-3"
                        data-bs-delay="5000"
                        data-bs-animation="true"
                        style={{
                            zIndex: 9999,
                        }}
                    >
                        <motion.div
                            initial={{
                                opacity: 0,
                                x: -20,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                            }}
                            exit={{
                                opacity: 0,
                                x: -20,
                            }}
                            transition={{
                                duration: 0.3,
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
        </>
    );
}

export default ModalForm;