import type { Dispatch, SetStateAction } from "react";
import type { SubmitHandler } from "react-hook-form";
import type { Entry } from "../interfaces/Entry";
import {
    handleResponse,
    postEntry,
    putEntry,
} from "./EntryService";

export const formatDateToString = (
    date: Date | null,
): string => {
    if (!date) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(
        2,
        "0",
    );
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

interface CreateEntrySubmitHandlerOptions {
    entry?: Entry;
    setShowToast: Dispatch<SetStateAction<boolean>>;
    setToastMessage: Dispatch<SetStateAction<string>>;
}

export const createEntrySubmitHandler = ({
    entry,
    setShowToast,
    setToastMessage,
}: CreateEntrySubmitHandlerOptions): SubmitHandler<Entry> => {
    return async (data: Entry): Promise<void> => {
        const castData: Entry = {
            ...data,
            date:
                typeof data.date === "object"
                    ? formatDateToString(
                          data.date as unknown as Date,
                      )
                    : data.date,
        };

        const response = entry
            ? await putEntry(castData)
            : await postEntry(castData);

        handleResponse(
            response,
            setShowToast,
            setToastMessage,
        );
    };
};