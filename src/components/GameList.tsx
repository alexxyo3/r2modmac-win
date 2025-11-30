import type { Community } from '../types/thunderstore';

interface GameSelectorProps {
    communities: Community[];
    selectedCommunity: string | null;
    onSelect: (identifier: string) => void;
}

export function GameSelector({ communities, selectedCommunity, onSelect }: GameSelectorProps) {
    // Function to get initials from game name
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();
    };

    // Function to get a consistent color based on string
    const getColorClass = (str: string) => {
        const colors = [
            'bg-red-500', 'bg-orange-500', 'bg-amber-500',
            'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
            'bg-cyan-500', 'bg-blue-500', 'bg-indigo-500',
            'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500',
            'bg-pink-500', 'bg-rose-500'
        ];
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <div className="p-4 pt-0 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 px-2">
                Select Game
            </h2>
            <div className="space-y-1 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                {communities.map(community => {
                    const isSelected = selectedCommunity === community.identifier;
                    // Try to guess icon URL (this is a best effort guess)
                    // const iconUrl = `https://gcdn.thunderstore.io/live/repository/icons/${community.identifier}.png`; 
                    // Disabling icon URL guess as it 403s. Sticking to reliable initials.

                    return (
                        <button
                            key={community.identifier}
                            onClick={() => onSelect(community.identifier)}
                            className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 group flex items-center gap-3 ${isSelected
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            {/* Game Icon / Initials */}
                            <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold text-white shadow-sm flex-shrink-0 overflow-hidden ${isSelected ? 'bg-blue-500' : getColorClass(community.name)
                                }`}>
                                {getInitials(community.name)}
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="font-medium text-sm truncate">{community.name}</div>
                                <div className={`text-xs truncate transition-colors ${isSelected ? 'text-blue-200' : 'text-gray-600 group-hover:text-gray-500'
                                    }`}>
                                    {community.identifier}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
