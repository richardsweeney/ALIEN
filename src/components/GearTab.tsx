import { useState } from "react";
import type { Weapon } from "../types";
import { RULEBOOK_WEAPONS } from "../data";

interface GearTabProps {
    gear: string[];
    weapons: Weapon[];
    onAdd: (item: string) => void;
    onRemove: (index: number) => void;
    onAddWeapon: (weapon: Weapon) => void;
    onRemoveWeapon: (index: number) => void;
}

export function GearTab({ gear, weapons, onAdd, onRemove, onAddWeapon, onRemoveWeapon }: GearTabProps) {
    const [newItem, setNewItem] = useState("");
    const [showWeaponPicker, setShowWeaponPicker] = useState(false);

    const handleAdd = () => {
        if (newItem.trim()) {
            onAdd(newItem.trim());
            setNewItem("");
        }
    };

    const weaponNames = new Set(weapons.map((w) => w.name));
    const otherGear = gear
        .map((item, i) => ({ item, originalIndex: i }))
        .filter(({ item }) => !weaponNames.has(item));
    const availableWeapons = RULEBOOK_WEAPONS.filter((w) => !weaponNames.has(w.name));

    return (
        <div className="bg-gray-900 border border-gray-700 rounded-b-lg rounded-tr-lg p-4 mb-4">
            <div className="text-xs font-bold tracking-widest text-gray-500 mb-2">
                WEAPONS
            </div>
            <div className="space-y-1">
                {weapons.map((weapon, i) => (
                    <div key={weapon.name} className="flex items-center gap-2 py-1">
                        <span className="text-gray-300 text-sm flex-1">{weapon.name}</span>
                        <span className="text-gray-500 text-xs shrink-0">
                            Dmg {weapon.damage} / {weapon.range}
                        </span>
                        <button
                            onClick={() => {
                                if (window.confirm(`Remove ${weapon.name}?`)) onRemoveWeapon(i);
                            }}
                            className="text-gray-600 hover:text-red-400 text-xs"
                        >
                            X
                        </button>
                    </div>
                ))}
            </div>

            {availableWeapons.length > 0 && (
                <div className="mt-3">
                    <button
                        onClick={() => setShowWeaponPicker(!showWeaponPicker)}
                        className="flex items-center gap-2 text-left"
                    >
                        <span className="text-green-400 text-xs font-medium">
                            {showWeaponPicker ? "▲ Hide" : "＋ Add weapon"}
                        </span>
                    </button>
                    {showWeaponPicker && (
                        <div className="mt-2 max-h-64 overflow-y-auto space-y-1">
                            {availableWeapons.map((weapon) => (
                                <button
                                    key={weapon.name}
                                    onClick={() => {
                                        onAddWeapon(weapon);
                                        if (availableWeapons.length <= 1) setShowWeaponPicker(false);
                                    }}
                                    className="w-full flex items-center justify-between bg-gray-800 hover:bg-gray-700 active:bg-gray-600 border border-gray-700 rounded px-3 py-2 text-left touch-manipulation"
                                >
                                    <span className="text-gray-200 text-sm font-medium">{weapon.name}</span>
                                    <span className="text-gray-500 text-xs shrink-0 ml-2">
                                        Dmg {weapon.damage} / {weapon.range}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="text-xs font-bold tracking-widest text-gray-500 mb-2">
                    OTHER
                </div>
                <div className="space-y-1">
                    {otherGear.map(({ item, originalIndex }) => (
                        <div key={originalIndex} className="flex items-center gap-2 py-1">
                            <span className="text-gray-300 text-sm flex-1">{item}</span>
                            <button
                                onClick={() => {
                                    if (window.confirm(`Remove ${item}?`)) onRemove(originalIndex);
                                }}
                                className="text-gray-600 hover:text-red-400 text-xs"
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 mt-3">
                    <input
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                        placeholder="Add gear..."
                        className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-gray-300 placeholder-gray-600 focus:border-green-600 focus:outline-none"
                    />
                    <button
                        onClick={handleAdd}
                        className="px-3 py-1 bg-green-900/50 border border-green-700 rounded text-green-400 text-sm hover:bg-green-900"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
}
