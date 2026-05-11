import { type Entry } from "../interfaces/Entry";

// services/entryService.ts
const BASE_URL = 'http://localhost:8080/api/v1/spendingTracker'

export async function handleResponse(response: Promise<Response>, setShowToast: (show: boolean) => void, setToastMessage: (message: string) => void) {
    const res = await response;
    if (res.ok) {
        const message = await res.text();
        console.log(message);
        setShowToast(true);
        setToastMessage(message);
    }
    else if (res.status === 409) {
        const error = await res.text();
        console.log(error);
        setShowToast(true);
        setToastMessage(error);
    }
    else {
        console.log("Something Went Wrong! ", res.status)
    }
}


export const getEntries = async (): Promise<Entry[]> => {
    const response = await fetch(`${BASE_URL}/all`);
    return response.json();
}

export const postEntry = async (entry: Entry): Promise<Response> => {
        const response = await fetch(`${BASE_URL}/add`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry)
        }); 
        return response;
}

export const putEntry = async (entry: Entry): Promise<Response> => {
    const response = await fetch(`${BASE_URL}/edit/date/${entry.date}`, {
        method: "PATCH",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
    });
    return response;
}

export const deleteEntry = async (date: string): Promise<Response> => {
    const response = await fetch(`${BASE_URL}/delete/${date}`, { method: "DELETE" });
    return response;
}