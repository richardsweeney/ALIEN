import type { Weapon } from "../types";

interface WeaponsTabProps {
    weapons: Weapon[];
}

export function WeaponsTab({ weapons }: WeaponsTabProps) {
    const formatBonus = (b: number) => (b > 0 ? `+${b}` : b === 0 ? "–" : `${b}`);

    return (
        <div className="bg-gray-900 border border-gray-700 rounded-b-lg rounded-tr-lg p-4 mb-4">
            <div className="space-y-2">
                {weapons.map((w, i) => (
                    <div
                        key={i}
                        className="bg-gray-800 rounded-lg p-3 flex items-center justify-between"
                    >
                        <div>
                            <span className="text-gray-200 font-medium text-sm">
                                {w.name}
                            </span>
                            <div className="flex gap-3 mt-1 text-xs text-gray-400">
                                <span>
                                    Bonus: <span className="text-amber-400">{formatBonus(w.bonus)}</span>
                                </span>
                                <span>
                                    Dmg:{" "}
                                    <span className="text-red-400 font-bold">{w.damage}</span>
                                </span>
                                <span>
                                    Range: <span className="text-blue-400">{w.range}</span>
                                </span>
                                {w.fullAuto && (
                                    <span className="text-orange-400">Full Auto</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
