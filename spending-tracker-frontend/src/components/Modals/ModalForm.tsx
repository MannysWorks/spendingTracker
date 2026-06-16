import type { Entry } from "../../interfaces/Entry";
import GenericModal from "./GenericModal";
import { useForm, type SubmitHandler, Controller } from "react-hook-form"
import { useState } from "react";
import Toast from "../Toast";
import { postEntry, putEntry, handleResponse } from "../../Services/EntryService";
import { AnimatePresence, motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../../css/ModalForm.css'

interface props {
    onClose: () => void
    entry?: Entry
}

// Helper function to convert Date to YYYY-MM-DD string format for LocalDate
const formatDateToString = (date: Date | null): string => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};


function ModalForm({ onClose, entry }: props) {
    const { register, handleSubmit, formState: { errors }, control } = useForm<Entry>({
        defaultValues: entry
    })
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const onSubmit: SubmitHandler<Entry> = async (data: Entry) => {
        // Type cast date to proper format for backend
        const castData = {
            ...data,
            date: typeof data.date === 'object'
                ? formatDateToString(data.date as unknown as Date)
                : data.date
        };

        if (entry) {
            const response = await putEntry(castData);
            handleResponse(response, setShowToast, setToastMessage);
        }
        else {
            const response = await postEntry(castData);
            handleResponse(response, setShowToast, setToastMessage);
        }
        console.log(castData);
    }

    type FieldName = "date" | "income" | "coldCash" | "grocery" | "fastFood" | "bills" | "subscriptions" | "gas" | "shopping" | "miscellaneous" | "robinHoodTransfer" | "robinHood" | "startOfDayBalance" | "endOfDayBalance" | "totalAssets" | "percentChange";

    interface FormField {
        name: FieldName;
        type: string;
        placeholder: string;
        label: string;
        rules?: Record<string, unknown>;
    }

    const formFields: FormField[] = [
        { name: "date", label: "", type: "date", placeholder: "YYYY-MM-DD", rules: { required: "Date is required" } },
        { name: "income", label: "💰 Income", type: "number", placeholder: "0.00", rules: { required: "Required", min: { value: 0, message: "Cannot be negative" }, valueAsNumber: true } },
        { name: "coldCash", label: "💵 Cold Cash", type: "number", placeholder: "0.00", rules: { required: "Required", min: { value: 0, message: "Cannot be negative" }, valueAsNumber: true } },
        { name: "grocery", label: "🛒 Grocery", type: "number", placeholder: "0.00", rules: { required: "Required", min: { value: 0, message: "Cannot be negative" }, valueAsNumber: true } },
        { name: "fastFood", label: "🍔 Fast Food", type: "number", placeholder: "0.00", rules: { required: "Required", min: { value: 0, message: "Cannot be negative" }, valueAsNumber: true } },
        { name: "bills", label: "🧾 Bills", type: "number", placeholder: "0.00", rules: { required: "Required", min: { value: 0, message: "Cannot be negative" }, valueAsNumber: true } },
        { name: "subscriptions", label: "📺 Subscriptions", type: "number", placeholder: "0.00", rules: { required: "Required", min: { value: 0, message: "Cannot be negative" }, valueAsNumber: true } },
        { name: "gas", label: "⛽ Gas", type: "number", placeholder: "0.00", rules: { required: "Required", min: { value: 0, message: "Cannot be negative" }, valueAsNumber: true } },
        { name: "shopping", label: "🛍️ Shopping", type: "number", placeholder: "0.00", rules: { required: "Required", min: { value: 0, message: "Cannot be negative" }, valueAsNumber: true } },
        { name: "miscellaneous", label: "🎲 Miscellaneous", type: "number", placeholder: "0.00", rules: { required: "Required", min: { value: 0, message: "Cannot be negative" }, valueAsNumber: true } },
        { name: "robinHoodTransfer", label: "📈 RobinHood Transfer", type: "number", placeholder: "0.00", rules: { required: "Required", min: { value: 0, message: "Cannot be negative" }, valueAsNumber: true } },
        { name: "robinHood", label: "🤖 RobinHood Balance", type: "number", placeholder: "0.00", rules: { required: "Required", min: { value: 0, message: "Cannot be negative" }, valueAsNumber: true } },
    ];

    const [index, setIndex] = useState(0);
    const currentField = formFields[index];
    const isDateField = currentField.name === "date";

    return <>
        <GenericModal
            title={entry ? "Edit Entry" : "Add New Entry"}
            onClose={onClose}
            body={
                <>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row g-3">

                            <div className="col-12">
                                {isDateField ? (
                                    // Date picker field using Controller
                                    <Controller
                                        name="date"
                                        control={control}
                                        rules={currentField.rules}
                                        render={({ field }) => (
                                            <div className="form-floating">
                                                <DatePicker
                                                    selected={field.value ? new Date(field.value as string) : null}
                                                    // Probably a bad way to handle this, but it works. The date picker returns a Date object,
                                                    //  but the backend expects a string in YYYY-MM-DD format.
                                                    //  So on change, we convert the Date to the string format before passing it to react-hook-form.
                                                    onChange={(date: any) => {
                                                        field.onChange(date ? formatDateToString(date) : "");
                                                    }}
                                                    dateFormat="yyyy-MM-dd"
                                                    className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                                                    placeholderText="YYYY-MM-DD"
                                                    isClearable
                                                />
                                                <label htmlFor="date">{currentField.label}</label>
                                                {errors.date && <div className="invalid-feedback">Date is required</div>}
                                            </div>
                                        )}
                                    />
                                ) : (
                                    // Regular input fields
                                    <div className="form-floating">
                                        <input
                                            key={currentField.name}
                                            {...register(currentField.name, currentField.rules)}
                                            type={currentField.type}
                                            className={`form-control ${errors[currentField.name] ? 'is-invalid' : ''}`}
                                            placeholder={currentField.placeholder}
                                            id={currentField.name}
                                        />
                                        <label>{currentField.label}</label>
                                        {errors[currentField.name] && <div className="invalid-feedback">This field is required</div>}
                                    </div>
                                )}
                            </div>
                            <div className="d-flex col-12">
                                <button onClick={() => setIndex(Math.max(0, index - 1))} className="btn btn-outline-primary w-50 h-60 rounded-pill me-2">
                                    previous
                                </button>
                                {index < formFields.length - 1 && (
                                    <button onClick={() => setIndex(Math.min(formFields.length - 1, index + 1))} className="btn btn-outline-primary w-50 h-60 rounded-pill">
                                        next
                                    </button>
                                )}
                            </div>
                            {index == formFields.length - 1 && (
                                <div className="col-12">
                                    <button type="submit" className="btn btn-success w-100 py-2 rounded-pill">
                                        Add Entry
                                    </button>
                                </div>
                            )}

                        </div>
                    </form>
                </>
            }
        />
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
    </>
}
export default ModalForm;