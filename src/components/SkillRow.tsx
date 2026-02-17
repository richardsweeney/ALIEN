interface SkillRowProps {
    skillName: string;
    skillLevel: number;
    attrValue: number;
    stress: number;
}

export function SkillRow({
    skillName,
    skillLevel,
    attrValue,
    stress,
}: SkillRowProps) {
    const basePool = attrValue + skillLevel;

    return (
        <div className="flex items-center justify-between py-2 px-3 border-b border-gray-800">
            <div className="flex items-center gap-2 flex-1">
                <span className="text-sm text-gray-200 font-medium">{skillName}</span>
                {skillLevel > 0 && (
                    <span className="text-xs text-gray-500">+{skillLevel}</span>
                )}
            </div>
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
            </div>
        </div>
    );
}
