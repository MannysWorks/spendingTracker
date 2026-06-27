import { type Entry } from "../interfaces/Entry";


// services/entryService.ts
const BASE_URL = 'https://api.mannys.works/api/v1/spendingTracker'

export async function handleResponse(response: Response, setShowToast: (show: boolean) => void, setToastMessage: (message: string) => void) {
    const res = await response;
    if (res.ok) {
        const message = await res.text();
        console.log(message);
        setShowToast(true);
        setToastMessage(message);
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    }
    else if (res.status === 409) {
        const error = await res.text();
        console.log(error);
        setShowToast(true);
        setToastMessage(error);
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    }
    else {
        console.log("Something Went Wrong! ", res.status)
    }
}



export const getEntries = async (): Promise<Entry[]> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/all`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        console.log("Status:", response.status);
        return [];
    }

    const text = await response.text();
    if (!text) {
        return [];
    }
    return JSON.parse(text);
}

export const postEntry = async (entry: Entry): Promise<Response> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/add`, {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(entry)
        }); 
        return response;
}

export const putEntry = async (entry: Entry): Promise<Response> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/edit/date/${entry.date}`, {
        method: "PATCH",
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(entry)
    });
    return response;
}

export const deleteEntry = async (date: string): Promise<Response> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/delete/${date}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response;
}