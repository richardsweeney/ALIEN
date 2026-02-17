import { useState, useEffect, useCallback } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./lib/firebase";
import { INITIAL_CHARACTERS } from "./data";
import { useAuth } from "./hooks/useAuth";
import { useCharacters } from "./hooks/useCharacters";
import { useUpdateCharacter } from "./hooks/useUpdateCharacter";
import { LoginScreen } from "./components/LoginScreen";
import { CharacterSelect } from "./components/CharacterSelect";
import { TopBar } from "./components/TopBar";
import { CharacterSheet } from "./components/CharacterSheet";

export default function App() {
    const { user, loading: authLoading, signIn, signOut } = useAuth();
    const { characters, loading: charsLoading } = useCharacters(!!user);
    const updateCharacter = useUpdateCharacter();
    const [gmCharId, setGmCharId] = useState("chaplain");
    const [isGM, setIsGM] = useState(false);
    const [gmChecked, setGmChecked] = useState(false);

    useEffect(() => {
        if (!user) {
            setIsGM(false);
            setGmChecked(false);
            return;
        }
        const init = async () => {
            try {
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                });
                const snap = await getDoc(doc(db, "config", "app"));
                if (snap.exists() && snap.data().gmUserId === user.uid) {
                    setIsGM(true);
                }
            } catch {
            }
            setGmChecked(true);
        };
        init();
    }, [user]);

    const handleGMLogin = useCallback(async () => {
        if (!user) return;
        await setDoc(doc(db, "config", "app"), { gmUserId: user.uid });
        setIsGM(true);
    }, [user]);

    const seedData = useCallback(async () => {
        if (!user) return;
        await Promise.all(
            INITIAL_CHARACTERS.map((c) => setDoc(doc(db, "characters", c.id), c)),
        );
        await setDoc(doc(db, "config", "app"), { gmUserId: user.uid });
        setIsGM(true);
    }, [user]);

    const claimCharacter = useCallback(
        (charId: string) => {
            const char = characters.find((c) => c.id === charId);
            if (char && user) {
                updateCharacter({ ...char, assignedUserId: user.uid });
            }
        },
        [characters, user, updateCharacter],
    );

    if (authLoading || charsLoading || (user && !gmChecked)) {
        return (
            <div className="min-h-screen bg-black text-green-400 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-xs tracking-[0.5em] text-green-600 mb-2">
                        ALIEN RPG
                    </div>
                    <div className="text-lg tracking-widest animate-pulse">
                        LOADING...
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return <LoginScreen onSignIn={signIn} />;
    }

    const myCharacter = characters.find((c) => c.assignedUserId === user.uid);

    if (!isGM && !myCharacter) {
        return (
            <CharacterSelect
                characters={characters}
                userName={user.displayName ?? user.email ?? "Unknown"}
                onSelect={claimCharacter}
                onGMLogin={handleGMLogin}
                onSeedData={seedData}
                onLogout={signOut}
            />
        );
    }

    const activeChar = isGM
        ? characters.find((c) => c.id === gmCharId)
        : myCharacter;

    return (
        <div className="min-h-screen bg-black text-white">
            <TopBar
                isGM={isGM}
                characters={characters}
                gmCharId={gmCharId}
                onGmCharChange={setGmCharId}
                onLogout={signOut}
                user={user}
            />
            <div className="p-4">
                {activeChar && (
                    <CharacterSheet char={activeChar} onChange={updateCharacter} />
                )}
            </div>
        </div>
    );
}
