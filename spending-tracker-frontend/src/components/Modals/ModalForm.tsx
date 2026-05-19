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
    return <>

        <GenericModal
            title={entry ? "Edit Entry" : "Add New Entry"}
            onClose={onClose}
            body={
                <>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row g-3">

                            {/* Date */}
                            <div className="col-12">
                                <div className="form-floating">
                                    <input
                                        {...register("date", {
                                            required: "Date is required",
                                            pattern: { value: /^\d{4}-\d{2}-\d{2}$/, message: "Date must be in YYYY-MM-DD format" }
                                        })}
                                        type="text"
                                        className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                                        placeholder="YYYY-MM-DD"
                                        id="date"
                                    />
                                    <label htmlFor="date">📅 Date</label>
                                    {errors.date && <div className="invalid-feedback">{errors.date.message}</div>}
                                </div>
                            </div>

                            {/* Money fields - 2 per row */}
                            <div className="col-6">
                                <div className="form-floating">
                                    <input
                                        {...register("income", { required: "Required", min: { value: 0, message: "Cannot be negative" }, valueAsNumber: true })}
                                        type="number"
                                        step="0.01"
                                        className={`form-control ${errors.income ? 'is-invalid' : ''}`}
                                        placeholder="0.00"
                                        id="income"
                                    />
                                    <label htmlFor="income">💰 Income</label>
                                    {errors.income && <div className="invalid-feedback">{errors.income.message}</div>}
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-floating">
                                    <input
                                        {...register("coldCash", { required: "Required", min: { value: 0, message: "Cannot be negative" }, valueAsNumber: true })}
                                        type="number"
                                        step="0.01"
                                        className={`form-control ${errors.coldCash ? 'is-invalid' : ''}`}
                                        placeholder="0.00"
                                        id="coldCash"
                                    />
                                    <label htmlFor="coldCash">💵 Cold Cash</label>
                                    {errors.coldCash && <div className="invalid-feedback">{errors.coldCash.message}</div>}
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-floating">
                                    <input
                                        {...register("grocery", { required: "Required", min: { value: 0, message: "Cannot be negative" }, valueAsNumber: true })}
                                        type="number"
                                        step="0.01"
                                        className={`form-control ${errors.grocery ? 'is-invalid' : ''}`}
                                        placeholder="0.00"
                                        id="grocery"
                                    />
                                    <label htmlFor="grocery">🛒 Grocery</label>
                                    {errors.grocery && <div className="invalid-feedback">{errors.grocery.message}</div>}
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-floating">
                                    <input
                                        {...register("fastFood", { required: "Required", min: { value: 0, message: "Cannot be negative" }, valueAsNumber: true })}
                                        type="number"
                                        step="0.01"
                                        className={`form-control ${errors.fastFood ? 'is-invalid' : ''}`}
                                        placeholder="0.00"
                                        id="fastFood"
                                    />
                                    <label htmlFor="fastFood">🍔 Fast Food</label>
                                    {errors.fastFood && <div className="invalid-feedback">{errors.fastFood.message}</div>}
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-floating">
                                    <input
                                        {...register("bills", { required: "Required", min: { value: 0, message: "Cannot be negative" }, valueAsNumber: true })}
                                        type="number"
                                        step="0.01"
                                        className={`form-control ${errors.bills ? 'is-invalid' : ''}`}
                                        placeholder="0.00"
                                        id="bills"
                                    />
                                    <label htmlFor="bills">🧾 Bills</label>
                                    {errors.bills && <div className="invalid-feedback">{errors.bills.message}</div>}
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-floating">
                                    <input
                                        {...register("subscriptions", { required: "Required", min: { value: 0, message: "Cannot be negative" }, valueAsNumber: true })}
                                        type="number"
                                        step="0.01"
                                        className={`form-control ${errors.subscriptions ? 'is-invalid' : ''}`}
                                        placeholder="0.00"
                                        id="subscriptions"
                                    />
                                    <label htmlFor="subscriptions">📺 Subscriptions</label>
                                    {errors.subscriptions && <div className="invalid-feedback">{errors.subscriptions.message}</div>}
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-floating">
                                    <input
                                        {...register("gas", { required: "Required", min: { value: 0, message: "Cannot be negative" }, valueAsNumber: true })}
                                        type="number"
                                        step="0.01"
                                        className={`form-control ${errors.gas ? 'is-invalid' : ''}`}
                                        placeholder="0.00"
                                        id="gas"
                                    />
                                    <label htmlFor="gas">⛽ Gas</label>
                                    {errors.gas && <div className="invalid-feedback">{errors.gas.message}</div>}
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-floating">
                                    <input
                                        {...register("shopping", { required: "Required", min: { value: 0, message: "Cannot be negative" }, valueAsNumber: true })}
                                        type="number"
                                        step="0.01"
                                        className={`form-control ${errors.shopping ? 'is-invalid' : ''}`}
                                        placeholder="0.00"
                                        id="shopping"
                                    />
                                    <label htmlFor="shopping">🛍️ Shopping</label>
                                    {errors.shopping && <div className="invalid-feedback">{errors.shopping.message}</div>}
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-floating">
                                    <input
                                        {...register("miscellaneous", { required: "Required", min: { value: 0, message: "Cannot be negative" }, valueAsNumber: true })}
                                        type="number"
                                        step="0.01"
                                        className={`form-control ${errors.miscellaneous ? 'is-invalid' : ''}`}
                                        placeholder="0.00"
                                        id="miscellaneous"
                                    />
                                    <label htmlFor="miscellaneous">🎲 Miscellaneous</label>
                                    {errors.miscellaneous && <div className="invalid-feedback">{errors.miscellaneous.message}</div>}
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-floating">
                                    <input
                                        {...register("robinHoodTransfer", { required: "Required", min: { value: 0, message: "Cannot be negative" }, valueAsNumber: true })}
                                        type="number"
                                        step="0.01"
                                        className={`form-control ${errors.robinHoodTransfer ? 'is-invalid' : ''}`}
                                        placeholder="0.00"
                                        id="robinHoodTransfer"
                                    />
                                    <label htmlFor="robinHoodTransfer">📈 RobinHood Transfer</label>
                                    {errors.robinHoodTransfer && <div className="invalid-feedback">{errors.robinHoodTransfer.message}</div>}
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-floating">
                                    <input
                                        {...register("robinHood", { required: "Required", min: { value: 0, message: "Cannot be negative" }, valueAsNumber: true })}
                                        type="number"
                                        step="0.01"
                                        className={`form-control ${errors.robinHood ? 'is-invalid' : ''}`}
                                        placeholder="0.00"
                                        id="robinHood"
                                    />
                                    <label htmlFor="robinHood">🤖 RobinHood Balance</label>
                                    {errors.robinHood && <div className="invalid-feedback">{errors.robinHood.message}</div>}
                                </div>
                            </div>

                            <div className="col-12">
                                <button type="submit" className="btn btn-primary w-100 py-3 rounded-pill">
                                    Add Entry
                                </button>
                            </div>

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