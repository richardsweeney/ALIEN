interface LoginScreenProps {
    onSignIn: () => void;
}

export function LoginScreen({ onSignIn }: LoginScreenProps) {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
            <div className="text-center">
                <div className="text-xs tracking-[0.5em] text-green-600 mb-1">
                    ALIEN RPG
                </div>
                <h1 className="text-4xl font-black tracking-wider text-green-400 mb-1">
                    DESTROYER OF WORLDS
                </h1>
                <p className="text-gray-500 text-sm tracking-widest mb-8">
                    CHARACTER MANAGER
                </p>
                <button
                    onClick={onSignIn}
                    className="px-8 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 text-sm tracking-widest hover:border-green-600 hover:text-green-400 transition-all"
                >
                    SIGN IN WITH GOOGLE
                </button>
            </div>
        </div>
    );
}
