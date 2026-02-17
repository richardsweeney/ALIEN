import { useState, useEffect, useCallback } from "react";
import {
    onAuthStateChanged,
    signInWithPopup,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    type User,
} from "firebase/auth";
import { auth } from "../lib/firebase";

const googleProvider = new GoogleAuthProvider();

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        return onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoading(false);
        });
    }, []);

    const signIn = useCallback(() => signInWithPopup(auth, googleProvider), []);

    const signOut = useCallback(() => firebaseSignOut(auth), []);

    return { user, loading, signIn, signOut };
}
