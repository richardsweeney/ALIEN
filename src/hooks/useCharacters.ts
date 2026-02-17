import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { CharacterData } from "../types";

export function useCharacters(enabled: boolean) {
    const [characters, setCharacters] = useState<CharacterData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!enabled) {
            setLoading(false);
            return;
        }
        return onSnapshot(
            collection(db, "characters"),
            (snapshot) => {
                const chars = snapshot.docs.map((d) => d.data() as CharacterData);
                chars.sort((a, b) => a.name.localeCompare(b.name));
                setCharacters(chars);
                setLoading(false);
            },
            () => {
                setLoading(false);
            },
        );
    }, [enabled]);

    return { characters, loading };
}
