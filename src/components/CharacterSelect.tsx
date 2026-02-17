import { useState } from "react";
import type { CharacterData } from "../types";
import { GM_PIN } from "../data";

interface CharacterSelectProps {
    characters: CharacterData[];
    userName: string;
    onSelect: (id: string) => void;
    onGMLogin: () => void;
    onSeedData: () => Promise<void>;
    onLogout: () => void;
}

export function CharacterSelect({
    characters,
    userName,
    onSelect,
    onGMLogin,
    onSeedData,
    onLogout,
}: CharacterSelectProps) {
    const [showPinInput, setShowPinInput] = useState(false);
    const [pinInput, setPinInput] = useState("");
    const [pinError, setPinError] = useState(false);

    const handleGMLogin = () => {
        if (pinInput === GM_PIN) {
            onGMLogin();
        } else {
            setPinError(true);
        }
    };
    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <div className="text-center pt-8 pb-6">
                <div className="text-xs tracking-[0.5em] text-green-600 mb-1">
                    ALIEN RPG
                </div>
                <h1 className="text-4xl font-black tracking-wider text-green-400 mb-1">
                    DESTROYER OF WORLDS
                </h1>
                <p className="text-gray-400 text-sm mb-1">
                    Signed in as {userName}
                </p>
                <p className="text-gray-500 text-sm tracking-widest">
                    SELECT YOUR CHARACTER
                </p>
            </div>

            <div className="flex-1 px-4 pb-4 max-w-3xl mx-auto w-full">
                {characters.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-sm mb-4">
                            No characters found. Seed the initial data to get started.
                        </p>
                        <button
                            onClick={onSeedData}
                            className="px-6 py-2 bg-green-900/50 border border-green-700 rounded-lg text-green-400 text-sm font-bold tracking-widest hover:bg-green-900 transition-colors"
                        >
                            INITIALIZE GAME DATA
                        </button>
                    </div>
                )}
                <div className="space-y-2">
                    {characters.map((char) => {
                        const taken = char.assignedUserId !== null;
                        return (
                            <button
                                key={char.id}
                                onClick={() => !taken && onSelect(char.id)}
                                disabled={taken}
                                className={`w-full flex items-center gap-3 bg-gray-900 border rounded-lg px-4 py-3 text-left transition-all ${taken
                                    ? "border-gray-800 opacity-40 cursor-not-allowed"
                                    : "border-gray-700 active:bg-gray-800"
                                    }`}
                            >
                                <div className="flex-1 min-w-0">
                                    <div className={`font-bold text-sm tracking-wider ${taken ? "text-gray-500" : "text-green-400"}`}>
                                        {char.name}
                                    </div>
                                    <div className="text-gray-500 text-xs">
                                        {char.rank} — {char.career}
                                    </div>
                                </div>
                                {taken ? (
                                    <span className="text-gray-600 text-xs italic shrink-0">Taken</span>
                                ) : (
                                    <svg className="w-4 h-4 text-gray-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 18l6-6-6-6" />
                                    </svg>
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-6 flex flex-col items-center gap-3">
                    {!showPinInput ? (
                        <button
                            onClick={() => setShowPinInput(true)}
                            className="px-6 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 text-sm tracking-widest hover:border-amber-600 hover:text-amber-400 transition-all"
                        >
                            GM ACCESS
                        </button>
                    ) : (
                        <div className="inline-flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-lg p-3">
                            <input
                                type="password"
                                value={pinInput}
                                onChange={(e) => {
                                    setPinInput(e.target.value);
                                    setPinError(false);
                                }}
                                onKeyDown={(e) => e.key === "Enter" && handleGMLogin()}
                                placeholder="Enter PIN"
                                maxLength={8}
                                className={`bg-gray-800 border rounded px-3 py-1.5 text-sm text-center w-32 focus:outline-none ${pinError
                                    ? "border-red-600 text-red-400"
                                    : "border-gray-600 text-white focus:border-amber-500"
                                    }`}
                                autoFocus
                            />
                            <button
                                onClick={handleGMLogin}
                                className="px-4 py-1.5 bg-amber-900/50 border border-amber-700 rounded text-amber-400 text-sm font-bold hover:bg-amber-900"
                            >
                                ENTER
                            </button>
                            <button
                                onClick={() => {
                                    setShowPinInput(false);
                                    setPinInput("");
                                    setPinError(false);
                                }}
                                className="text-gray-600 hover:text-gray-400 text-sm px-2"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                    <button
                        onClick={onLogout}
                        className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 text-sm hover:text-red-400 hover:border-red-700 transition-colors"
                    >
                        LOG OUT
                    </button>
                </div>
            </div>
        </div>
    );
}
