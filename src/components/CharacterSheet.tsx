import { useState } from "react";
import type { Attribute, CharacterData } from "../types";
import { ATTR_COLORS, ATTR_LABELS, TALENT_DESCRIPTIONS, CHARACTER_BACKSTORIES } from "../data";
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
import { HealthTracker } from "./HealthTracker";
import { SkillsTab } from "./SkillsTab";
import { GearTab } from "./GearTab";

type Tab = "skills" | "gear";
const TABS: Tab[] = ["skills", "gear"];
const ATTRIBUTES: Attribute[] = ["strength", "agility", "wits", "empathy"];

function Chevron({ open }: { open: boolean }) {
    return (
        <svg
            className={`w-4 h-4 text-green-600 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
        >
            <path d="M6 9l6 6 6-6" />
        </svg>
    );
}

interface CharacterSheetProps {
    char: CharacterData;
    onChange: (updated: CharacterData) => void;
}

export function CharacterSheet({ char, onChange }: CharacterSheetProps) {
    const [newInjury, setNewInjury] = useState("");
    const [activeTab, setActiveTab] = useState<Tab>("skills");
    const [showSummary, setShowSummary] = useState(true);
    const [showTalents, setShowTalents] = useState(true);
    const [showAttributes, setShowAttributes] = useState(true);
    const [showHealth, setShowHealth] = useState(true);

    const toggleHealth = (index: number) => {
        const clickedIsDamaged = index >= char.health;
        onChange({ ...char, health: clickedIsDamaged ? index + 1 : index });
    };

    const toggleStress = (index: number) => {
        onChange({ ...char, stress: index < char.stress ? index : index + 1 });
    };

    const addInjury = () => {
        if (newInjury.trim()) {
            onChange({
                ...char,
                criticalInjuries: [...char.criticalInjuries, newInjury.trim()],
            });
            setNewInjury("");
        }
    };

    const removeInjury = (i: number) => {
        onChange({
            ...char,
            criticalInjuries: char.criticalInjuries.filter((_, idx) => idx !== i),
        });
    };

    return (
        <div className="max-w-2xl mx-auto">
            <button
                onClick={() => setShowSummary(!showSummary)}
                className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-lg p-4 mb-4 text-left"
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black tracking-wider text-green-400">
                            {char.name}
                        </h1>
                        <span className="text-sm text-gray-400">{char.rank}</span>
                        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:gap-x-4 gap-y-0.5 mt-1 text-sm">
                            <span className="text-gray-300">{char.fullName}</span>
                            <span className="text-gray-400">{char.career}</span>
                            <span className="text-gray-400">Age {char.age}</span>
                            <span className="text-amber-400 italic">{char.personality}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        {CHARACTER_IMAGES[char.id] && (
                            <img
                                src={CHARACTER_IMAGES[char.id]}
                                alt={char.name}
                                className="w-16 h-16 object-cover rounded-lg border-2 border-gray-700"
                            />
                        )}
                        <Chevron open={showSummary} />
                    </div>
                </div>
                {showSummary && (
                    <div className="mt-4 space-y-3">
                        {CHARACTER_BACKSTORIES[char.id] && (
                            <p className="text-sm leading-relaxed text-gray-400 italic">
                                {CHARACTER_BACKSTORIES[char.id]}
                            </p>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <div className="text-xs font-bold tracking-widest text-gray-500 mb-1">BUDDY</div>
                                <div className="flex items-center gap-2">
                                    {char.buddy && CHARACTER_IMAGES[char.buddy.toLowerCase()] && (
                                        <img
                                            src={CHARACTER_IMAGES[char.buddy.toLowerCase()]}
                                            alt={char.buddy}
                                            className="w-6 h-6 object-cover rounded border border-gray-700"
                                        />
                                    )}
                                    <span className="text-gray-300 text-sm">{char.buddy || "None"}</span>
                                </div>
                            </div>
                            <div>
                                <div className="text-xs font-bold tracking-widest text-gray-500 mb-1">RIVAL</div>
                                <div className="flex items-center gap-2">
                                    {char.rival && CHARACTER_IMAGES[char.rival.toLowerCase()] && (
                                        <img
                                            src={CHARACTER_IMAGES[char.rival.toLowerCase()]}
                                            alt={char.rival}
                                            className="w-6 h-6 object-cover rounded border border-gray-700"
                                        />
                                    )}
                                    <span className="text-gray-300 text-sm">{char.rival || "None"}</span>
                                </div>
                            </div>
                            <div>
                                <div className="text-xs font-bold tracking-widest text-gray-500 mb-1">SIGNATURE ITEM</div>
                                <span className="text-gray-300 text-sm">{char.signatureItem}</span>
                            </div>
                        </div>
                    </div>
                )}
            </button>

            <div className="bg-gray-900 border border-gray-700 rounded-lg mb-4">
                <button
                    onClick={() => setShowTalents(!showTalents)}
                    className="w-full flex items-center justify-between px-3 py-3 text-left"
                >
                    <span className="text-xs font-bold tracking-widest text-gray-500">TALENTS</span>
                    <Chevron open={showTalents} />
                </button>
                {showTalents && (
                    <div className="px-4 pb-4 space-y-3">
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
                )}
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-lg mb-4">
                <button
                    onClick={() => setShowAttributes(!showAttributes)}
                    className="w-full flex items-center justify-between px-3 py-3 text-left"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold tracking-widest text-gray-500">ATTRIBUTES</span>
                        {!showAttributes && (
                            <span className="text-xs">
                                {ATTRIBUTES.map((attr, i) => (
                                    <span key={attr}>
                                        {i > 0 && <span className="text-gray-600"> | </span>}
                                        <span className={ATTR_COLORS[attr]}>{ATTR_LABELS[attr].slice(0, 3)} {char[attr]}</span>
                                    </span>
                                ))}
                            </span>
                        )}
                    </div>
                    <Chevron open={showAttributes} />
                </button>
                {showAttributes && (
                    <div className="px-4 pb-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {ATTRIBUTES.map((attr) => (
                                <div key={attr} className="flex flex-col items-center bg-gray-800 border border-gray-700 rounded-lg py-3 px-2">
                                    <span className={`text-base font-bold tracking-wider ${ATTR_COLORS[attr]}`}>
                                        {ATTR_LABELS[attr]}
                                    </span>
                                    <span className="text-xl font-bold text-white mt-1">
                                        {char[attr]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-lg mb-4">
                <button
                    onClick={() => setShowHealth(!showHealth)}
                    className="w-full flex items-center justify-between px-3 py-3 text-left"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold tracking-widest text-gray-500">HEALTH & STATUS</span>
                        {!showHealth && (
                            <span className="text-xs">
                                <span className="text-red-400">Hp {char.health}/{char.maxHealth}</span>
                                {!char.android && <><span className="text-gray-600"> | </span><span className="text-yellow-400">Stress {char.stress}</span></>}
                            </span>
                        )}
                    </div>
                    <Chevron open={showHealth} />
                </button>
                {showHealth && (
                    <div className="px-4 pb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <HealthTracker
                                    current={char.health}
                                    max={char.maxHealth}
                                    label="HEALTH"
                                    color="bg-red-600 text-red-600"
                                    onToggle={toggleHealth}
                                />
                                {!char.android && (
                                    <HealthTracker
                                        current={char.stress}
                                        max={10}
                                        label="STRESS"
                                        color="bg-yellow-500 text-yellow-500"
                                        onToggle={toggleStress}
                                    />
                                )}
                            </div>
                            <div>
                                <div className="bg-gray-800 rounded-lg p-3 mb-3">
                                    <div className="text-xs font-bold tracking-widest text-gray-500 mb-1">
                                        ARMOR
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-300 text-sm">
                                            {char.armor || "None"}
                                        </span>
                                        {char.armorRating > 0 && (
                                            <div className="bg-gray-800 border border-gray-600 rounded px-2 py-0.5 flex items-center gap-1">
                                                <span className="text-gray-200 font-bold text-sm">{char.armorRating}</span>
                                                <svg className="w-3.5 h-3.5 text-gray-200" viewBox="0 0 24 24" fill="currentColor">
                                                    <rect x="2" y="2" width="20" height="20" rx="4" opacity="0.3" />
                                                    <circle cx="8" cy="8" r="2" /><circle cx="16" cy="8" r="2" />
                                                    <circle cx="8" cy="16" r="2" /><circle cx="16" cy="16" r="2" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-gray-800 rounded-lg p-3">
                                    <div className="text-xs font-bold tracking-widest text-gray-500 mb-1">
                                        ENCUMBRANCE
                                    </div>
                                    <span className="text-white text-lg font-bold">
                                        {char.encumbrance}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3">
                            <div className="text-xs font-bold tracking-widest text-gray-500 mb-2">
                                CRITICAL INJURIES
                            </div>
                            {char.criticalInjuries.map((inj, i) => (
                                <div key={i} className="flex items-center gap-2 mb-1">
                                    <span className="text-red-400 text-sm flex-1">{inj}</span>
                                    <button
                                        onClick={() => removeInjury(i)}
                                        className="text-gray-600 hover:text-red-400 text-xs"
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                            <div className="flex gap-2 mt-1">
                                <input
                                    value={newInjury}
                                    onChange={(e) => setNewInjury(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && addInjury()}
                                    placeholder="Add critical injury..."
                                    className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-gray-300 placeholder-gray-600 focus:border-red-600 focus:outline-none"
                                />
                                <button
                                    onClick={addInjury}
                                    className="px-3 py-1 bg-red-900/50 border border-red-700 rounded text-red-400 text-sm hover:bg-red-900"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-1 mb-1">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-t-lg text-sm font-bold tracking-wider transition-colors ${activeTab === tab
                            ? "bg-gray-900 text-green-400 border border-b-0 border-gray-700"
                            : "bg-gray-800 text-gray-500 hover:text-gray-300"
                            }`}
                    >
                        {tab.toUpperCase()}
                    </button>
                ))}
            </div>

            {activeTab === "skills" && (
                <SkillsTab char={char} />
            )}

            {activeTab === "gear" && (
                <GearTab
                    gear={char.gear}
                    weapons={char.weapons}
                    onAdd={(item) =>
                        onChange({ ...char, gear: [...char.gear, item] })
                    }
                    onRemove={(i) =>
                        onChange({
                            ...char,
                            gear: char.gear.filter((_, idx) => idx !== i),
                        })
                    }
                    onAddWeapon={(weapon) =>
                        onChange({
                            ...char,
                            gear: [...char.gear, weapon.name],
                            weapons: [...char.weapons, weapon],
                        })
                    }
                    onRemoveWeapon={(i) => {
                        const weapon = char.weapons[i];
                        if (!weapon) return;
                        onChange({
                            ...char,
                            weapons: char.weapons.filter((_, idx) => idx !== i),
                            gear: char.gear.filter((g) => g !== weapon.name),
                        });
                    }}
                />
            )}


        </div>
    );
}
