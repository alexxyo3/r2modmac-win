import { useEffect, useState } from 'react'
import { ThunderstoreAPI } from './api/thunderstore'
import type { Community, Package } from './types/thunderstore'
import { useProfileStore } from './store/useProfileStore'
import { Layout } from './components/Layout'
import { GameSelector } from './components/GameList'
import { SearchBar } from './components/SearchBar'
import { VirtualizedModGrid } from './components/VirtualizedModGrid'
import { ModDetailModal } from './components/ModDetailModal'

function App() {
  const [communities, setCommunities] = useState<Community[]>([])
  const [packages, setPackages] = useState<Package[]>([])
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMods, setLoadingMods] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMod, setSelectedMod] = useState<Package | null>(null)

  const { profiles, createProfile, loadProfiles, activeProfileId, selectProfile, deleteProfile } = useProfileStore()
  const [newProfileName, setNewProfileName] = useState('')

  useEffect(() => {
    loadProfiles()
    ThunderstoreAPI.getCommunities()
      .then(setCommunities)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (selectedCommunity) {
      setLoadingMods(true)
      ThunderstoreAPI.getPackages(selectedCommunity)
        .then(setPackages)
        .catch(err => setError(err.message))
        .finally(() => setLoadingMods(false))
    }
  }, [selectedCommunity])

  const handleCreateProfile = () => {
    if (!newProfileName || !selectedCommunity) return
    createProfile(newProfileName, selectedCommunity)
    setNewProfileName('')
  }

  const handleInstallMod = async (pkg: Package) => {
    if (!activeProfileId) {
      alert('Please select a profile first')
      return
    }
    // TODO: Implement installation logic
    console.log('Installing mod:', pkg.name)
  }

  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.owner.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeProfile = profiles.find(p => p.id === activeProfileId)

  const [gameSearchQuery, setGameSearchQuery] = useState('')

  const filteredCommunities = communities.filter(c =>
    c.name.toLowerCase().includes(gameSearchQuery.toLowerCase()) ||
    c.identifier.toLowerCase().includes(gameSearchQuery.toLowerCase())
  )

  const sidebar = (
    <div className="h-full flex flex-col">
      {/* Profile Section */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          Profiles
        </h2>
        <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
          {profiles.map(p => (
            <div
              key={p.id}
              onClick={() => selectProfile(p.id)}
              className={`p-2.5 rounded cursor-pointer transition-colors flex justify-between items-center ${activeProfileId === p.id
                ? 'bg-blue-600'
                : 'bg-gray-700 hover:bg-gray-600'
                }`}
            >
              <div>
                <div className="font-semibold text-sm">{p.name}</div>
                <div className="text-xs text-gray-400">{p.gameIdentifier}</div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); deleteProfile(p.id) }}
                className="text-red-400 hover:text-red-300 p-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="bg-gray-700 border border-gray-600 p-2 rounded flex-1 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="New Profile"
            value={newProfileName}
            onChange={e => setNewProfileName(e.target.value)}
          />
          <button
            onClick={handleCreateProfile}
            className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded font-semibold text-sm transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Game Selector */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="p-4 pb-0">
          <input
            className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-sm focus:outline-none focus:border-blue-500 transition-colors mb-2"
            placeholder="Search games..."
            value={gameSearchQuery}
            onChange={e => setGameSearchQuery(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="p-4 text-center text-gray-400">Loading games...</div>
        ) : (
          <GameSelector
            communities={filteredCommunities}
            selectedCommunity={selectedCommunity}
            onSelect={setSelectedCommunity}
          />
        )}
      </div>
    </div>
  )

  const main = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {selectedCommunity ? communities.find(c => c.identifier === selectedCommunity)?.name : 'r2modmac'}
            </h1>
            {activeProfile && (
              <p className="text-sm text-gray-400 mt-1">Profile: {activeProfile.name}</p>
            )}
          </div>
          <div className="text-sm text-gray-400">
            {packages.length} mods available
          </div>
        </div>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Mod Grid */}
      <div className="flex-1 overflow-hidden">
        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded p-4 m-6 mb-0">
            <p className="text-red-400">Error: {error}</p>
          </div>
        )}

        {!selectedCommunity ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">🎮</div>
              <h2 className="text-2xl font-bold text-gray-400 mb-2">Select a game to get started</h2>
              <p className="text-gray-500">Choose a game from the sidebar to browse mods</p>
            </div>
          </div>
        ) : loadingMods ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin text-6xl mb-4">⚙️</div>
              <p className="text-gray-400">Loading mods...</p>
            </div>
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-gray-400 mb-2">No mods found</h2>
              <p className="text-gray-500">Try a different search term</p>
            </div>
          </div>
        ) : (
          <VirtualizedModGrid
            packages={filteredPackages}
            onInstall={handleInstallMod}
            onModClick={setSelectedMod}
          />
        )}
      </div>
    </div>
  )

  return (
    <>
      <Layout sidebar={sidebar} main={main} />
      {selectedMod && (
        <ModDetailModal
          mod={selectedMod.versions[0]}
          isOpen={!!selectedMod}
          onClose={() => setSelectedMod(null)}
          onInstall={() => handleInstallMod(selectedMod)}
          isInstalled={false}
        />
      )}
    </>
  )
}

export default App
