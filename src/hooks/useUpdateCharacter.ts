import { useCallback } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { CharacterData } from "../types";

export function useUpdateCharacter() {
    return useCallback(
        (updated: CharacterData) =>
            setDoc(doc(db, "characters", updated.id), updated),
        [],
    );
}
