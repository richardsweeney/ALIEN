import { useState } from "react";
import type { Attribute, CharacterData } from "../types";
import { ATTR_COLORS, ATTR_LABELS, TALENT_DESCRIPTIONS } from "../data";
import { HealthTracker } from "./HealthTracker";
import { StatControl } from "./StatControl";
import { SkillsTab } from "./SkillsTab";
import { GearTab } from "./GearTab";

type Tab = "skills" | "gear";
const TABS: Tab[] = ["skills", "gear"];
const ATTRIBUTES: Attribute[] = ["strength", "agility", "wits", "empathy"];

function TalentCard({ name }: { name: string }) {
    const [open, setOpen] = useState(true);
    const description = TALENT_DESCRIPTIONS[name];

    return (
        <button
            onClick={() => setOpen(!open)}
            className="bg-gray-800 rounded-lg p-3 text-left w-full transition-colors hover:bg-gray-700"
        >
            <div className="flex items-center justify-between">
                <span className="text-amber-400 font-bold text-sm">{name}</span>
                <span className="text-gray-500 text-xs">
                    {open ? "▲" : "▼ info"}
                </span>
            </div>
            {open && description && (
                <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                    {description}
                </p>
            )}
        </button>
    );
}

interface CharacterSheetProps {
    char: CharacterData;
    onChange: (updated: CharacterData) => void;
}

export function CharacterSheet({ char, onChange }: CharacterSheetProps) {
    const [newInjury, setNewInjury] = useState("");
    const [activeTab, setActiveTab] = useState<Tab>("skills");

    const updateAttr = (attr: Attribute, val: number) => {
        const updated = { ...char, [attr]: val };
        if (attr === "strength") {
            updated.maxHealth = val;
            updated.health = Math.min(char.health, val);
        }
        onChange(updated);
    };


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
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-lg p-4 mb-4">
                <div className="flex items-baseline gap-3">
                    <h1 className="text-2xl font-black tracking-wider text-green-400">
                        {char.name}
                    </h1>
                    <span className="text-sm text-gray-400">{char.rank}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:gap-x-4 gap-y-0.5 mt-1 text-sm">
                    <span className="text-gray-300">{char.fullName}</span>
                    <span className="text-gray-400">{char.career}</span>
                    <span className="text-gray-400">Age {char.age}</span>
                    <span className="text-amber-400 italic">{char.personality}</span>
                </div>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-4">
                <div className="text-xs font-bold tracking-widest text-gray-500 mb-3">
                    ATTRIBUTES
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {ATTRIBUTES.map((attr) => (
                        <StatControl
                            key={attr}
                            label={ATTR_LABELS[attr]}
                            value={char[attr]}
                            onChange={(v) => updateAttr(attr, v)}
                            color={ATTR_COLORS[attr]}
                        />
                    ))}
                </div>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-4">
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

            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-4">
                <div className="text-xs font-bold tracking-widest text-gray-500 mb-2">
                    TALENTS
                </div>
                <div className="grid grid-cols-1 gap-2">
                    {[char.talent1, char.talent2].map((talent) => (
                        <TalentCard key={talent} name={talent} />
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                    <div className="text-xs font-bold tracking-widest text-gray-500 mb-1">
                        BUDDY
                    </div>
                    <span className="text-green-400 text-sm font-medium">
                        {char.buddy || "None"}
                    </span>
                </div>
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                    <div className="text-xs font-bold tracking-widest text-gray-500 mb-1">
                        RIVAL
                    </div>
                    <span className="text-red-400 text-sm font-medium">
                        {char.rival || "None"}
                    </span>
                </div>
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                    <div className="text-xs font-bold tracking-widest text-gray-500 mb-1">
                        SIGNATURE ITEM
                    </div>
                    <span className="text-gray-300 text-sm">{char.signatureItem}</span>
                </div>
            </div>
        </div>
    );
}
