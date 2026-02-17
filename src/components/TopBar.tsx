import { useState, useEffect } from "react";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "../lib/firebase";
import { INITIAL_CHARACTERS } from "../data";
import type { CharacterData } from "../types";
import { useUsers, type AppUser } from "../hooks/useUsers";
import { useUpdateCharacter } from "../hooks/useUpdateCharacter";

interface TopBarProps {
    isGM: boolean;
    characters: CharacterData[];
    gmCharId: string;
    onGmCharChange: (id: string) => void;
    onLogout: () => void;
    user: User;
}

export function TopBar({
    isGM,
    characters,
    gmCharId,
    onGmCharChange,
    onLogout,
    user,
}: TopBarProps) {
    const users = useUsers();
    const updateCharacter = useUpdateCharacter();
    const [showManage, setShowManage] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const seedData = async () => {
        const snap = await getDocs(collection(db, "characters"));
        if (snap.size > 0) {
            if (!window.confirm("Characters already exist. Reset all data to defaults?")) {
                return;
            }
        }
        await Promise.all(
            INITIAL_CHARACTERS.map((c) => setDoc(doc(db, "characters", c.id), c)),
        );
        await setDoc(doc(db, "config", "app"), { gmUserId: user.uid });
    };

    const assignUser = (characterId: string, userId: string | null) => {
        const char = characters.find((c) => c.id === characterId);
        if (!char) return;
        if (userId) {
            const prev = characters.find(
                (c) => c.assignedUserId === userId && c.id !== characterId,
            );
            if (prev) {
                updateCharacter({ ...prev, assignedUserId: null });
            }
        }
        updateCharacter({ ...char, assignedUserId: userId });
    };

    const getUserLabel = (u: AppUser) =>
        u.displayName ?? u.email ?? u.uid;

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [menuOpen]);

    return (
        <>
            <div className="sticky top-0 z-10 bg-gray-950/95 backdrop-blur border-b border-gray-800 px-4 py-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-green-600 text-xs tracking-[0.3em] font-bold">
                            ALIEN RPG
                        </span>
                        {isGM && (
                            <span className="bg-amber-900/50 border border-amber-700 text-amber-400 text-xs font-bold px-2 py-0.5 rounded">
                                GM
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="flex flex-col justify-center items-center w-10 h-10 gap-1 shrink-0"
                    >
                        <span className={`block w-5 h-0.5 bg-gray-400 transition-all duration-200 ${menuOpen ? "translate-y-[3px] rotate-45" : ""}`} />
                        <span className={`block w-5 h-0.5 bg-gray-400 transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
                        <span className={`block w-5 h-0.5 bg-gray-400 transition-all duration-200 ${menuOpen ? "-translate-y-[3px] -rotate-45" : ""}`} />
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div className="fixed inset-0 z-20 bg-black/95 overflow-y-auto pt-16 px-4 pb-4">
                    <button
                        onClick={() => setMenuOpen(false)}
                        className="absolute top-4 right-4 flex flex-col justify-center items-center w-10 h-10 gap-1"
                    >
                        <span className="block w-5 h-0.5 bg-gray-400 translate-y-[3px] rotate-45" />
                        <span className="block w-5 h-0.5 bg-gray-400 opacity-0" />
                        <span className="block w-5 h-0.5 bg-gray-400 -translate-y-[3px] -rotate-45" />
                    </button>
                    <div className="max-w-2xl mx-auto space-y-3">
                        {isGM && (
                            <div>
                                <div className="text-xs font-bold tracking-widest text-gray-500 mb-2">
                                    VIEW CHARACTER
                                </div>
                                <div className="grid grid-cols-2 gap-1.5">
                                    {characters.map((c) => (
                                        <button
                                            key={c.id}
                                            onClick={() => onGmCharChange(c.id)}
                                            className={`px-3 py-2 rounded text-xs font-bold text-left transition-colors ${gmCharId === c.id
                                                ? "bg-green-900/60 border border-green-600 text-green-400"
                                                : "bg-gray-800 border border-gray-700 text-gray-400 active:bg-gray-700"
                                                }`}
                                        >
                                            {c.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {isGM && (
                            <div>
                                <button
                                    onClick={() => setShowManage(!showManage)}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-amber-400 text-xs font-bold hover:border-amber-600 transition-colors"
                                >
                                    {showManage ? "HIDE ASSIGNMENTS" : "MANAGE ASSIGNMENTS"}
                                </button>

                                {showManage && (
                                    <div className="mt-2 bg-gray-900 border border-gray-700 rounded-lg p-4">
                                        <div className="space-y-2">
                                            {characters.map((char) => (
                                                <div key={char.id} className="flex items-center gap-3">
                                                    <span className={`text-sm font-bold w-28 shrink-0 ${char.disabled ? "text-gray-600 line-through" : "text-green-400"}`}>
                                                        {char.name}
                                                    </span>
                                                    <select
                                                        value={char.assignedUserId ?? ""}
                                                        onChange={(e) =>
                                                            assignUser(char.id, e.target.value || null)
                                                        }
                                                        className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-gray-300 focus:outline-none focus:border-green-600"
                                                    >
                                                        <option value="">Unassigned</option>
                                                        {users.map((u) => (
                                                            <option key={u.uid} value={u.uid}>
                                                                {getUserLabel(u)}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        onClick={() => updateCharacter({ ...char, disabled: !char.disabled })}
                                                        className={`text-xs font-bold px-2 py-1 rounded border shrink-0 ${char.disabled
                                                            ? "bg-red-900/30 border-red-700 text-red-400"
                                                            : "bg-gray-800 border-gray-600 text-gray-400"
                                                            }`}
                                                    >
                                                        {char.disabled ? "OFF" : "ON"}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-700">
                                            <button
                                                onClick={seedData}
                                                className="px-3 py-1.5 bg-green-900/50 border border-green-700 rounded text-green-400 text-xs font-bold hover:bg-green-900 transition-colors"
                                            >
                                                SEED / RESET DATA
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            onClick={onLogout}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-400 text-xs font-bold hover:text-red-400 hover:border-red-700 transition-colors"
                        >
                            LOG OUT
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
