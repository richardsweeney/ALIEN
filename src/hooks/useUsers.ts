import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface AppUser {
    uid: string;
    displayName: string | null;
    email: string | null;
}

export function useUsers() {
    const [users, setUsers] = useState<AppUser[]>([]);

    useEffect(() => {
        return onSnapshot(collection(db, "users"), (snapshot) => {
            setUsers(snapshot.docs.map((d) => d.data() as AppUser));
        });
    }, []);

    return users;
}
