function AiEnginePulseComponent() {
    return (
        <div className="flex items-center gap-3 bg-white/50 dark:bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-neutral-200 dark:border-white/10 shadow-sm">
            <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
            </div>
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">AI Engine Active</span>
        </div>
    );
}

export default AiEnginePulseComponent;