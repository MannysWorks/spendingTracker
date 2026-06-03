import type { Entry } from "../../interfaces/Entry";
import GenericModal from "./GenericModal";
import { useForm, type SubmitHandler } from "react-hook-form"
import { useState } from "react";
import Toast from "../Toast";
import { postEntry, putEntry, handleResponse } from "../../Services/EntryService";
import { AnimatePresence, motion } from "framer-motion";

interface props {
    onClose: () => void
    entry?: Entry
}


function ModalForm({ onClose, entry }: props) {
    const { register, handleSubmit, formState: { errors } } = useForm<Entry>({
        defaultValues: entry
    })
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");


    const onSubmit: SubmitHandler<Entry> = async (data: Entry) => {
        if (entry) {
            const response = await putEntry(data);
            handleResponse(response, setShowToast, setToastMessage);
        }
        else {
            const response = await postEntry(data);
            handleResponse(response, setShowToast, setToastMessage);
        }
        console.log(data);
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
        { name: "date", label: "📅 Date", type: "text", placeholder: "YYYY-MM-DD", rules: { required: "Date is required", pattern: { value: /^\d{4}-\d{2}-\d{2}$/, message: "Date must be in YYYY-MM-DD format" } } },
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
    return <>
        <GenericModal
            title={entry ? "Edit Entry" : "Add New Entry"}
            onClose={onClose}
            body={
                <>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row g-3">

                            <div className="col-12">
                                <div className="form-floating">
                                    <input
                                        key={formFields[index].name}
                                        {...register(formFields[index].name, formFields[index].rules)}
                                        type={formFields[index].type}
                                        className={`form-control ${errors[formFields[index].name] ? 'is-invalid' : ''}`}
                                        placeholder={formFields[index].placeholder}
                                        id={formFields[index].name}
                                    />
                                    <label>{formFields[index].label}</label>
                                    {errors[formFields[index].name] && <div className="invalid-feedback">This field is required</div>}
                                </div>
                            </div>
                            <div className="d-flex col-12">
                                <button onClick={() => setIndex(Math.max(0, index - 1))} className="btn btn-primary w-100 py-3 rounded-pill">
                                    previous
                                </button>
                                <button onClick={() => setIndex(Math.min(formFields.length - 1, index + 1))} className="btn btn-primary w-100 py-3 rounded-pill">
                                    next
                                </button>
                            </div>
                            {index == formFields.length - 1 && (
                                <div className="col-12">
                                    <button type="submit" className="btn btn-primary w-100 py-3 rounded-pill">
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