interface HealthTrackerProps {
    current: number;
    max: number;
    label: string;
    color: string;
    onToggle: (index: number) => void;
}

export function HealthTracker({
    current,
    max,
    label,
    color,
    onToggle,
}: HealthTrackerProps) {
    return (
        <div className="mb-3">
            <div className="text-xs font-bold tracking-widest mb-1 text-gray-400">
                {label} ({current}/{max})
            </div>
            <div className="flex gap-1">
                {Array.from({ length: max }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => onToggle(i)}
                        className={`w-7 h-7 border-2 rounded transition-all touch-manipulation ${i < current
                            ? `${color} border-current`
                            : "border-gray-600 bg-gray-900 active:border-gray-400"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
