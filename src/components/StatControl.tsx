interface StatControlProps {
    label: string;
    value: number;
    onChange: (v: number) => void;
    color?: string;
}

export function StatControl({ label, value, onChange, color }: StatControlProps) {
    return (
        <div className="flex flex-col items-center bg-gray-800 border border-gray-700 rounded-lg py-3 px-2">
            <span
                className={`text-sm font-bold tracking-wider ${color || "text-gray-400"}`}
            >
                {label}
            </span>
            <div className="flex items-center gap-1 mt-3">
                <button
                    onClick={() => onChange(Math.max(0, value - 1))}
                    className="w-7 h-7 rounded bg-gray-800 border border-gray-600 text-gray-300 active:bg-gray-700 text-sm font-bold select-none touch-manipulation"
                >
                    -
                </button>
                <span className="w-8 text-center text-xl font-bold text-white">
                    {value}
                </span>
                <button
                    onClick={() => onChange(value + 1)}
                    className="w-7 h-7 rounded bg-gray-800 border border-gray-600 text-gray-300 active:bg-gray-700 text-sm font-bold select-none touch-manipulation"
                >
                    +
                </button>
            </div>
        </div>
    );
}
