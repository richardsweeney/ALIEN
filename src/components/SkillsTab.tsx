import { useState } from "react";
import type { Attribute, CharacterData, SkillDef, Weapon } from "../types";
import { ALL_SKILLS, ATTR_COLORS, ATTR_LABELS } from "../data";
import { SkillRow } from "./SkillRow";

const ATTRIBUTES: Attribute[] = ["strength", "agility", "wits", "empathy"];

const RANGE_MODIFIERS: Record<string, number> = {
    Engaged: 2,
    Short: 1,
    Medium: 0,
    Long: -1,
    Extreme: -2,
};

const RANGE_OPTIONS = ["Engaged", "Short", "Medium", "Long", "Extreme"] as const;

interface WeaponModifiers {
    aim: boolean;
    range: string;
}

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

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
    return (
        <label
            className="flex items-center gap-1.5 cursor-pointer select-none"
            onClick={(e) => { e.preventDefault(); onChange(!checked); }}
            onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); onChange(!checked); } }}
            tabIndex={0}
        >
            <div
                className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition-colors ${checked ? "bg-green-600 border-green-500" : "bg-gray-800 border-gray-600"}`}
            >
                {checked && (
                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 6l3 3 5-5" />
                    </svg>
                )}
            </div>
            <span className="text-gray-400 text-xs">{label}</span>
        </label>
    );
}

function groupSkillsByAttr(): Record<Attribute, SkillDef[]> {
    const grouped: Record<Attribute, SkillDef[]> = {
        strength: [],
        agility: [],
        wits: [],
        empathy: [],
    };
    for (const sk of ALL_SKILLS) {
        grouped[sk.attr].push(sk);
    }
    return grouped;
}

const GROUPED_SKILLS = groupSkillsByAttr();

interface WeaponRowProps {
    weapon: Weapon;
    attrValue: number;
    skillLevel: number;
    stress: number;
    attrColor: string;
    fullAutoActive: boolean;
    onToggleAuto: (active: boolean) => void;
    modifiers: WeaponModifiers;
    onModifiersChange: (mods: WeaponModifiers) => void;
}

function WeaponRow({ weapon, attrValue, skillLevel, stress, attrColor, fullAutoActive, onToggleAuto, modifiers, onModifiersChange }: WeaponRowProps) {
    const isRanged = weapon.skill === "Ranged Combat";
    const rangeBonus = isRanged && modifiers.range ? (RANGE_MODIFIERS[modifiers.range] ?? 0) : 0;
    const aimBonus = isRanged && modifiers.aim ? 2 : 0;
    const basePool = Math.max(0, attrValue + skillLevel + weapon.bonus + (fullAutoActive ? 2 : 0) + rangeBonus + aimBonus);

    return (
        <div className="py-1.5 px-3 pl-8 border-b border-gray-800/50 bg-gray-850">
            <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${attrColor}`}>
                    {weapon.name}
                    {weapon.bonus !== 0 && (
                        <span className="text-gray-500 ml-1">
                            ({weapon.bonus > 0 ? `+${weapon.bonus}` : weapon.bonus})
                        </span>
                    )}
                </span>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                    <div className="flex items-center gap-1">
                        <div className="bg-gray-800 border border-gray-600 rounded px-2 py-0.5 flex items-center gap-1">
                            <span className="text-gray-200 font-bold text-sm">{basePool}</span>
                            <svg className="w-3.5 h-3.5 text-gray-200" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="2" y="2" width="20" height="20" rx="4" opacity="0.3" />
                                <circle cx="8" cy="8" r="2" /><circle cx="16" cy="8" r="2" />
                                <circle cx="8" cy="16" r="2" /><circle cx="16" cy="16" r="2" />
                            </svg>
                        </div>
                        {stress > 0 && (
                            <div className="bg-yellow-600/20 border border-yellow-500 rounded px-2 py-0.5 flex items-center gap-1">
                                <span className="text-yellow-400 font-bold text-sm">{stress}</span>
                                <svg className="w-3.5 h-3.5 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                                    <ellipse cx="12" cy="10" rx="5" ry="6" opacity="0.6" />
                                    <path d="M7 10 Q4 4 2 6 M17 10 Q20 4 22 6 M6 13 Q3 16 1 15 M18 13 Q21 16 23 15 M8 15 Q6 20 4 20 M16 15 Q18 20 20 20 M10 16 Q9 22 8 23 M14 16 Q15 22 16 23" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                </svg>
                            </div>
                        )}
                        {fullAutoActive && (
                            <div className="bg-yellow-600/20 border border-yellow-500 rounded px-2 py-0.5 flex items-center gap-1">
                                <span className="text-yellow-400 font-bold text-sm">+1</span>
                                <svg className="w-3.5 h-3.5 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                                    <ellipse cx="12" cy="10" rx="5" ry="6" opacity="0.6" />
                                    <path d="M7 10 Q4 4 2 6 M17 10 Q20 4 22 6 M6 13 Q3 16 1 15 M18 13 Q21 16 23 15 M8 15 Q6 20 4 20 M16 15 Q18 20 20 20 M10 16 Q9 22 8 23 M14 16 Q15 22 16 23" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between mt-0.5">
                <span className="text-gray-600 text-xs leading-none">
                    Dmg {weapon.damage} / {weapon.range}
                    {weapon.armorPiercing && <span className="text-cyan-400 ml-1">Armour Piercing</span>}
                </span>
            </div>
            {isRanged && (
                <div className="flex items-center gap-3 mt-1.5 pt-1.5 border-t border-gray-800/50">
                    <Checkbox
                        checked={modifiers.aim}
                        onChange={(v) => onModifiersChange({ ...modifiers, aim: v })}
                        label="Aim"
                    />
                    {weapon.fullAuto && (
                        <Checkbox
                            checked={fullAutoActive}
                            onChange={onToggleAuto}
                            label="Auto"
                        />
                    )}
                    <div className="flex items-center gap-1.5">
                        <span className="text-gray-500 text-xs">Range</span>
                        <select
                            value={modifiers.range}
                            onChange={(e) => onModifiersChange({ ...modifiers, range: e.target.value })}
                            className="bg-gray-800 border border-gray-600 rounded px-1.5 py-0.5 text-xs text-gray-300 focus:border-green-600 focus:outline-none"
                        >
                            <option value="">--</option>
                            {RANGE_OPTIONS.map((r) => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
}

interface SkillsTabProps {
    char: CharacterData;
    onChange: (updated: CharacterData) => void;
}

function SkillGroup({ attr, char, weaponsBySkill, autoWeapons, onToggleAuto, weaponMods, onWeaponModsChange }: {
    attr: Attribute;
    char: CharacterData;
    weaponsBySkill: (name: string) => Weapon[];
    autoWeapons: Set<string>;
    onToggleAuto: (weaponName: string, active: boolean) => void;
    weaponMods: Record<string, WeaponModifiers>;
    onWeaponModsChange: (weaponName: string, mods: WeaponModifiers) => void;
}) {
    const [open, setOpen] = useState(true);

    const defaultMods: WeaponModifiers = { aim: false, range: "" };

    return (
        <div>
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-3 py-3 bg-gray-800/80 border-b border-gray-700 text-left"
            >
                <span className={`text-xs font-bold tracking-widest ${ATTR_COLORS[attr]}`}>
                    {ATTR_LABELS[attr]} ({char[attr]})
                </span>
                <Chevron open={open} />
            </button>
            {open && GROUPED_SKILLS[attr]?.map((sk) => {
                const weapons = weaponsBySkill(sk.name);
                return (
                    <div key={sk.name}>
                        <SkillRow
                            skillName={sk.name}
                            skillLevel={char.skills[sk.name] || 0}
                            attrValue={char[attr]}
                            stress={char.stress}
                        />
                        {weapons.map((w) => (
                            <WeaponRow
                                key={w.name}
                                weapon={w}
                                attrValue={char[attr]}
                                skillLevel={char.skills[sk.name] || 0}
                                stress={char.stress}
                                attrColor={ATTR_COLORS[attr]}
                                fullAutoActive={autoWeapons.has(w.name)}
                                onToggleAuto={(active) => onToggleAuto(w.name, active)}
                                modifiers={weaponMods[w.name] ?? defaultMods}
                                onModifiersChange={(mods) => onWeaponModsChange(w.name, mods)}
                            />
                        ))}
                    </div>
                );
            })}
        </div>
    );
}

export function SkillsTab({ char, onChange: _onChange }: SkillsTabProps) {
    const [autoWeapons, setAutoWeapons] = useState<Set<string>>(new Set());
    const [weaponMods, setWeaponMods] = useState<Record<string, WeaponModifiers>>({});

    const weaponsBySkill = (skillName: string) =>
        char.weapons.filter((w) => w.skill === skillName);

    const handleToggleAuto = (weaponName: string, active: boolean) => {
        setAutoWeapons((prev) => {
            const next = new Set(prev);
            if (active) {
                next.add(weaponName);
            } else {
                next.delete(weaponName);
            }
            return next;
        });
    };

    const handleWeaponModsChange = (weaponName: string, mods: WeaponModifiers) => {
        setWeaponMods((prev) => ({ ...prev, [weaponName]: mods }));
    };

    return (
        <div className="bg-gray-900 border border-gray-700 rounded-b-lg rounded-tr-lg overflow-hidden mb-4">
            {ATTRIBUTES.map((attr) => (
                <SkillGroup
                    key={attr}
                    attr={attr}
                    char={char}
                    weaponsBySkill={weaponsBySkill}
                    autoWeapons={autoWeapons}
                    onToggleAuto={handleToggleAuto}
                    weaponMods={weaponMods}
                    onWeaponModsChange={handleWeaponModsChange}
                />
            ))}
        </div>
    );
}
