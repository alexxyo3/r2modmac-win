interface ProgressModalProps {
    isOpen: boolean;
    modName: string;
    progress: number;
    status: 'downloading' | 'extracting' | 'installing' | 'complete' | 'error';
    onClose: () => void;
}

export function ProgressModal({ isOpen, modName, progress, status, onClose }: ProgressModalProps) {
    if (!isOpen) return null;

    const statusEmojis = {
        downloading: '📥',
        extracting: '📦',
        installing: '⚙️',
        complete: '✅',
        error: '❌',
    };

    const statusLabels = {
        downloading: 'Downloading',
        extracting: 'Extracting',
        installing: 'Installing',
        complete: 'Complete',
        error: 'Error',
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-gray-700 shadow-2xl">
                <div className="text-center mb-6">
                    <div className="text-6xl mb-4 animate-pulse">{statusEmojis[status]}</div>
                    <h2 className="text-2xl font-bold text-white mb-2">{statusLabels[status]}</h2>
                    <p className="text-gray-400">{modName}</p>
                </div>

                {status !== 'complete' && status !== 'error' && (
                    <div className="mb-6">
                        <div className="bg-gray-700/50 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300 rounded-full"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-center text-sm text-gray-400 mt-2">{progress}%</p>
                    </div>
                )}

                {status === 'complete' && (
                    <button
                        onClick={onClose}
                        className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold py-3 rounded-xl transition-all duration-200"
                    >
                        Done
                    </button>
                )}

                {status === 'error' && (
                    <button
                        onClick={onClose}
                        className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold py-3 rounded-xl transition-all duration-200"
                    >
                        Close
                    </button>
                )}
            </div>
        </div>
    );
}
