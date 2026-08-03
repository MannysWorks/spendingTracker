import type { RegisterOptions } from "react-hook-form";
import type { Entry } from "../interfaces/Entry";

export type FieldName =
    | "date"
    | "income"
    | "coldCash"
    | "grocery"
    | "fastFood"
    | "bills"
    | "subscriptions"
    | "gas"
    | "shopping"
    | "miscellaneous"
    | "robinHoodTransfer"
    | "robinHood"
    | "startOfDayBalance"
    | "endOfDayBalance"
    | "totalAssets"
    | "percentChange";

export interface FormField {
    name: FieldName;
    type: "date" | "number";
    placeholder: string;
    label: string;
    description: string;
    rules?: RegisterOptions<Entry, FieldName>;
}

const requiredAmountRules: RegisterOptions<Entry, FieldName> = {
    required: "This field is required",
    min: {
        value: 0,
        message: "Cannot be negative",
    },
    valueAsNumber: true,
};

export const modalFormFields: FormField[] = [
    {
        name: "date",
        label: "Date",
        description: "Select the date for this entry.",
        type: "date",
        placeholder: "YYYY-MM-DD",
        rules: {
            required: "Date is required",
        },
    },
    {
        name: "income",
        label: "Income",
        description: "Enter the income received for this day.",
        type: "number",
        placeholder: "0.00",
        rules: requiredAmountRules,
    },
    {
        name: "coldCash",
        label: "Cold Cash",
        description: "Enter the physical cash currently available.",
        type: "number",
        placeholder: "0.00",
        rules: requiredAmountRules,
    },
    {
        name: "grocery",
        label: "Grocery",
        description: "Enter the amount spent on groceries.",
        type: "number",
        placeholder: "0.00",
        rules: requiredAmountRules,
    },
    {
        name: "fastFood",
        label: "Fast Food",
        description: "Enter the amount spent on dining or fast food.",
        type: "number",
        placeholder: "0.00",
        rules: requiredAmountRules,
    },
    {
        name: "bills",
        label: "Bills",
        description: "Enter the total amount paid toward bills.",
        type: "number",
        placeholder: "0.00",
        rules: requiredAmountRules,
    },
    {
        name: "subscriptions",
        label: "Subscriptions",
        description: "Enter the amount spent on subscriptions.",
        type: "number",
        placeholder: "0.00",
        rules: requiredAmountRules,
    },
    {
        name: "gas",
        label: "Gas",
        description: "Enter the amount spent on fuel.",
        type: "number",
        placeholder: "0.00",
        rules: requiredAmountRules,
    },
    {
        name: "shopping",
        label: "Shopping",
        description: "Enter the amount spent while shopping.",
        type: "number",
        placeholder: "0.00",
        rules: requiredAmountRules,
    },
    {
        name: "miscellaneous",
        label: "Miscellaneous",
        description: "Enter any spending that does not fit another category.",
        type: "number",
        placeholder: "0.00",
        rules: requiredAmountRules,
    },
    {
        name: "robinHoodTransfer",
        label: "Robinhood Transfer",
        description: "Enter the amount transferred into Robinhood.",
        type: "number",
        placeholder: "0.00",
        rules: requiredAmountRules,
    },
    {
        name: "robinHood",
        label: "Robinhood Balance",
        description: "Enter the current balance of the Robinhood account.",
        type: "number",
        placeholder: "0.00",
        rules: requiredAmountRules,
    },
];