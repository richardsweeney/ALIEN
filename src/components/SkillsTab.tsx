import { useState } from "react";
import type { Attribute, CharacterData, SkillDef, Weapon } from "../types";
import { ALL_SKILLS, ATTR_COLORS, ATTR_LABELS } from "../data";
import { SkillRow } from "./SkillRow";

const ATTRIBUTES: Attribute[] = ["strength", "agility", "wits", "empathy"];

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
}

function WeaponRow({ weapon, attrValue, skillLevel, stress, attrColor }: WeaponRowProps) {
    const [fullAutoActive, setFullAutoActive] = useState(false);
    const basePool = attrValue + skillLevel + weapon.bonus + (fullAutoActive ? 2 : 0);

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
                    {weapon.fullAuto && (
                        <label className="flex items-center gap-1 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={fullAutoActive}
                                onChange={(e) => setFullAutoActive(e.target.checked)}
                                className="w-3 h-3 rounded border-gray-600 bg-gray-800 accent-red-500"
                            />
                            <span className="text-gray-500 text-xs">Auto</span>
                        </label>
                    )}
                    <div className="flex items-center gap-1">
                        <div className="bg-gray-800 border border-gray-600 rounded px-2 py-0.5 flex items-center gap-1">
                            <span className="text-gray-200 font-bold text-sm">{basePool}</span>
                            <svg className="w-3.5 h-3.5 text-gray-200" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="2" y="2" width="20" height="20" rx="4" opacity="0.3" />
                                <circle cx="8" cy="8" r="2" /><circle cx="16" cy="8" r="2" />
                                <circle cx="8" cy="16" r="2" /><circle cx="16" cy="16" r="2" />
                            </svg>
                        </div>
                        {(stress > 0 || fullAutoActive) && (
                            <div className="bg-yellow-600/20 border border-yellow-500 rounded px-2 py-0.5 flex items-center gap-1">
                                <span className="text-yellow-400 font-bold text-sm">{stress + (fullAutoActive ? 1 : 0)}</span>
                                <svg className="w-3.5 h-3.5 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                                    <ellipse cx="12" cy="10" rx="5" ry="6" opacity="0.6" />
                                    <path d="M7 10 Q4 4 2 6 M17 10 Q20 4 22 6 M6 13 Q3 16 1 15 M18 13 Q21 16 23 15 M8 15 Q6 20 4 20 M16 15 Q18 20 20 20 M10 16 Q9 22 8 23 M14 16 Q15 22 16 23" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <span className="text-gray-600 text-xs leading-none mt-0.5 block">
                Dmg {weapon.damage} / {weapon.range}
            </span>
        </div>
    );
}

interface SkillsTabProps {
    char: CharacterData;
}

export function SkillsTab({ char }: SkillsTabProps) {
    const weaponsBySkill = (skillName: string) =>
        char.weapons.filter((w) => w.skill === skillName);

    return (
        <div className="bg-gray-900 border border-gray-700 rounded-b-lg rounded-tr-lg overflow-hidden mb-4">
            {ATTRIBUTES.map((attr) => (
                <div key={attr}>
                    <div className="px-3 py-1.5 bg-gray-800/80 border-b border-gray-700">
                        <span
                            className={`text-xs font-bold tracking-widest ${ATTR_COLORS[attr]}`}
                        >
                            {ATTR_LABELS[attr]} ({char[attr]})
                        </span>
                    </div>
                    {GROUPED_SKILLS[attr]?.map((sk) => {
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
                                    />
                                ))}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
