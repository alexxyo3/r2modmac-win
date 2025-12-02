import { useState, useEffect } from 'react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const [steamPath, setSteamPath] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadSettings();
        }
    }, [isOpen]);

    const loadSettings = async () => {
        try {
            const settings = await window.ipcRenderer.getSettings();
            setSteamPath(settings.steam_path || '');
        } catch (e) {
            console.error("Failed to load settings", e);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await window.ipcRenderer.saveSettings({ steam_path: steamPath || null });
            onClose();
        } catch (e) {
            console.error("Failed to save settings", e);
            alert("Failed to save settings");
        }
        setLoading(false);
    };

    const handleBrowse = async () => {
        try {
            const path = await window.ipcRenderer.selectFolder();
            if (path) {
                setSteamPath(path);
            }
        } catch (e) {
            console.error("Failed to select folder", e);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-4">Settings</h2>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        Steam Directory
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={steamPath}
                            onChange={(e) => setSteamPath(e.target.value)}
                            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                            placeholder="/Users/username/Library/Application Support/Steam"
                        />
                        <button
                            onClick={handleBrowse}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                        >
                            Browse
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        The folder containing steamapps and userdata.
                        <br />
                        For CrossOver: Select the Steam folder inside your bottle (e.g., drive_c/Program Files (x86)/Steam).
                    </p>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
}
