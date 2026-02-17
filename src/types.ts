export type CombatSkill = "Ranged Combat" | "Close Combat";

export interface Weapon {
    name: string;
    bonus: number;
    damage: number;
    range: string;
    fullAuto: boolean;
    skill: CombatSkill;
}

export interface CharacterData {
    id: string;
    name: string;
    rank: string;
    career: string;
    fullName: string;
    age: number;
    personality: string;
    strength: number;
    agility: number;
    wits: number;
    empathy: number;
    health: number;
    maxHealth: number;
    stress: number;
    skills: Record<string, number>;
    talent1: string;
    talent2: string;
    buddy: string;
    rival: string;
    signatureItem: string;
    gear: string[];
    weapons: Weapon[];
    armor: string;
    armorRating: number;
    encumbrance: number;
    criticalInjuries: string[];
    assignedUserId: string | null;
    android: boolean;
}

export type Attribute = "strength" | "agility" | "wits" | "empathy";

export interface SkillDef {
    name: string;
    attr: Attribute;
}
