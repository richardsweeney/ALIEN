import { useState } from "react";
import type { CharacterData } from "../types";
import { ALL_SKILLS, ATTR_LABELS, ATTR_COLORS, TALENT_DESCRIPTIONS, CHARACTER_BACKSTORIES, GM_PIN } from "../data";
import type { Attribute } from "../types";
import chaplainImg from "../images/Chaplain.jpg";
import danteImg from "../images/Dante.jpg";
import ionaImg from "../images/Iona.jpg";
import zmijewskiImg from "../images/Zmijewski.jpg";
import hammerImg from "../images/Hammer.jpg";
import masonImg from "../images/Mason.jpg";
import silvaImg from "../images/Silva.jpg";

const CHARACTER_IMAGES: Record<string, string> = {
    chaplain: chaplainImg,
    dante: danteImg,
    iona: ionaImg,
    zmijewski: zmijewskiImg,
    hammer: hammerImg,
    mason: masonImg,
    silva: silvaImg,
};

const ATTRIBUTES: Attribute[] = ["strength", "agility", "wits", "empathy"];

interface CharacterSelectProps {
    characters: CharacterData[];
    userName: string;
    onSelect: (id: string) => void;
    onGMLogin: () => void;
    onSeedData: () => Promise<void>;
    onLogout: () => void;
}

function CharacterDetail({
    char,
    available,
    onSelect,
    onBack,
}: {
    char: CharacterData;
    available: boolean;
    onSelect: () => void;
    onBack: () => void;
}) {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <div className="sticky top-0 z-10 bg-gray-950/95 backdrop-blur border-b border-gray-800 px-4 py-3 flex items-center gap-3">
                <button
                    onClick={onBack}
                    className="text-gray-400 hover:text-white text-sm flex items-center gap-1"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    Back
                </button>
            </div>

            <div className="flex-1 px-4 pb-6 max-w-2xl mx-auto w-full">
                <div className="py-6 flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-wider text-green-400">
                            {char.name}
                        </h1>
                        <div className="flex flex-col gap-0.5 mt-2 text-sm">
                            <span className="text-gray-300">{char.fullName}</span>
                            <span className="text-gray-400">{char.rank} — {char.career}</span>
                            <span className="text-gray-400">Age {char.age}</span>
                            <span className="text-amber-400 italic">{char.personality}</span>
                        </div>
                    </div>
                    {CHARACTER_IMAGES[char.id] && (
                        <img
                            src={CHARACTER_IMAGES[char.id]}
                            alt={char.name}
                            className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border-2 border-gray-700 shrink-0"
                        />
                    )}
                </div>

                {CHARACTER_BACKSTORIES[char.id] && (
                    <div className="bg-gray-900/60 border border-gray-800 rounded-lg px-4 py-4 mb-4">
                        <p className="text-sm leading-relaxed text-gray-400 italic">
                            {CHARACTER_BACKSTORIES[char.id]}
                        </p>
                    </div>
                )}

                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-4">
                    <div className="text-xs font-bold tracking-widest text-gray-500 mb-3">
                        ATTRIBUTES
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {ATTRIBUTES.map((attr) => (
                            <div key={attr} className="bg-gray-800 border border-gray-700 rounded-lg py-3 px-2 text-center">
                                <div className={`text-sm font-bold tracking-wider ${ATTR_COLORS[attr]}`}>
                                    {ATTR_LABELS[attr]}
                                </div>
                                <div className="text-xl font-bold text-white mt-1">
                                    {char[attr]}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden mb-4">
                    {ATTRIBUTES.map((attr) => {
                        const attrSkills = ALL_SKILLS.filter((sk) => sk.attr === attr);
                        const hasSkills = attrSkills.some((sk) => (char.skills[sk.name] || 0) > 0);
                        if (!hasSkills) return null;
                        return (
                            <div key={attr}>
                                <div className="px-3 py-1.5 bg-gray-800/80 border-b border-gray-700">
                                    <span className={`text-xs font-bold tracking-widest ${ATTR_COLORS[attr]}`}>
                                        {ATTR_LABELS[attr]}
                                    </span>
                                </div>
                                {attrSkills.map((sk) => {
                                    const level = char.skills[sk.name] || 0;
                                    if (level === 0) return null;
                                    const basePool = char[attr] + level;
                                    return (
                                        <div key={sk.name} className="flex items-center justify-between py-2 px-3 border-b border-gray-800">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-300 text-sm">{sk.name}</span>
                                                <span className="text-gray-500 text-xs">+{level}</span>
                                            </div>
                                            <div className="bg-gray-800 border border-gray-600 rounded px-2 py-0.5 flex items-center gap-1">
                                                <span className="text-gray-200 font-bold text-sm">{basePool}</span>
                                                <svg className="w-3.5 h-3.5 text-gray-200" viewBox="0 0 24 24" fill="currentColor">
                                                    <rect x="2" y="2" width="20" height="20" rx="4" opacity="0.3" />
                                                    <circle cx="8" cy="8" r="2" /><circle cx="16" cy="8" r="2" />
                                                    <circle cx="8" cy="16" r="2" /><circle cx="16" cy="16" r="2" />
                                                </svg>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>

                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-4">
                    <div className="text-xs font-bold tracking-widest text-gray-500 mb-3">
                        TALENTS
                    </div>
                    <div className="space-y-3">
                        {[char.talent1, char.talent2].map((talent) => (
                            <div key={talent}>
                                <div className="text-amber-400 font-bold text-sm">{talent}</div>
                                {TALENT_DESCRIPTIONS[talent] && (
                                    <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                                        {TALENT_DESCRIPTIONS[talent]}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-4">
                    <div className="text-xs font-bold tracking-widest text-gray-500 mb-3">
                        GEAR
                    </div>
                    <div className="space-y-1">
                        {char.gear.map((item, i) => (
                            <div key={i} className="text-gray-300 text-sm py-0.5">{item}</div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                        <div className="text-xs font-bold tracking-widest text-gray-500 mb-1">BUDDY</div>
                        <span className="text-green-400 text-sm font-medium">{char.buddy || "None"}</span>
                    </div>
                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                        <div className="text-xs font-bold tracking-widest text-gray-500 mb-1">RIVAL</div>
                        <span className="text-red-400 text-sm font-medium">{char.rival || "None"}</span>
                    </div>
                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                        <div className="text-xs font-bold tracking-widest text-gray-500 mb-1">SIGNATURE ITEM</div>
                        <span className="text-gray-300 text-sm">{char.signatureItem}</span>
                    </div>
                </div>

                {available && (
                    <button
                        onClick={onSelect}
                        className="w-full py-3 bg-green-900/50 border border-green-700 rounded-lg text-green-400 text-sm font-bold tracking-widest hover:bg-green-900 transition-colors"
                    >
                        SELECT CHARACTER
                    </button>
                )}
            </div>
        </div>
    );
}

export function CharacterSelect({
    characters,
    userName,
    onSelect,
    onGMLogin,
    onSeedData,
    onLogout,
}: CharacterSelectProps) {
    const [detailChar, setDetailChar] = useState<CharacterData | null>(null);
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

    const isAvailable = (char: CharacterData) =>
        !char.assignedUserId && !char.disabled;

    if (detailChar) {
        const available = isAvailable(detailChar);
        return (
            <CharacterDetail
                char={detailChar}
                available={available}
                onSelect={() => onSelect(detailChar.id)}
                onBack={() => setDetailChar(null)}
            />
        );
    }

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
            </div>

            <div className="flex-1 px-4 pb-4 max-w-3xl mx-auto w-full">
                <div className="bg-gray-900/60 border border-gray-800 rounded-lg px-4 py-4 mb-6 text-sm leading-relaxed text-gray-400">
                    <p>
                        You are a Colonial Marine — part of an elite rapid-response unit deployed to the outer rim on a classified operation. Your platoon has been pulled from routine garrison duty and dropped into something far above your pay grade. The brass aren't talking. Your orders are need-to-know, and right now, you don't need to know.
                    </p>
                    <p className="mt-3">
                        Trust your squad. Watch your corners. And whatever happens — don't panic.
                    </p>
                </div>

                <div className="text-xl sm:text-2xl font-black tracking-widest text-green-400 mb-4 text-center">
                    SELECT YOUR CHARACTER
                </div>
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
                    {[...characters].sort((a, b) => {
                        if (a.id === "silva") return -1;
                        if (b.id === "silva") return 1;
                        return Number(!!a.disabled) - Number(!!b.disabled);
                    }).map((char) => {
                        const available = isAvailable(char);
                        const statusLabel = char.disabled
                            ? "Unavailable"
                            : char.assignedUserId
                                ? "Taken"
                                : null;

                        return (
                            <div
                                key={char.id}
                                className={`w-full flex items-center gap-3 bg-gray-900 border rounded-lg px-4 py-3 transition-all ${available
                                    ? "border-gray-700"
                                    : "border-gray-800 opacity-40"
                                    }`}
                            >
                                {CHARACTER_IMAGES[char.id] && (
                                    <img
                                        src={CHARACTER_IMAGES[char.id]}
                                        alt={char.name}
                                        className="w-10 h-10 object-cover rounded border border-gray-700 shrink-0"
                                    />
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className={`font-bold text-sm tracking-wider ${available ? "text-green-400" : "text-gray-500"}`}>
                                        {char.name}
                                    </div>
                                    <div className="text-gray-500 text-xs">
                                        {char.rank} — {char.career}
                                    </div>
                                </div>
                                {statusLabel ? (
                                    <span className="text-gray-600 text-xs italic shrink-0">{statusLabel}</span>
                                ) : (
                                    <button
                                        onClick={() => setDetailChar(char)}
                                        className="text-gray-400 text-xs font-medium px-3 py-1.5 bg-gray-800 border border-gray-700 rounded hover:border-green-600 hover:text-green-400 transition-colors shrink-0"
                                    >
                                        More info
                                    </button>
                                )}
                            </div>
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
