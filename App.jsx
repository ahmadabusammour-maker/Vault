import React, { useState, useRef } from 'react';
import { 
  Plus, X, Gamepad2, Play, Link as LinkIcon, 
  FileCode, Image as ImageIcon, Trash2, Heart, AlertCircle
} from 'lucide-react';

export default function App() {
  const [games, setGames] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [playingGame, setPlayingGame] = useState(null);

  // New Features State
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [gameToDelete, setGameToDelete] = useState(null);

  // New Game Form State
  const [addMethod, setAddMethod] = useState('url'); // 'url' or 'file'
  const [newGameName, setNewGameName] = useState('');
  const [newGameUrl, setNewGameUrl] = useState('');
  const [newGameCover, setNewGameCover] = useState('');
  const [newGameFileContent, setNewGameFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleAddGame = (e) => {
    e.preventDefault();
    if (!newGameName.trim()) return;

    const newGame = {
      id: crypto.randomUUID(),
      name: newGameName,
      type: addMethod,
      cover: newGameCover || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800', // Default abstract gaming cover
      favorite: false,
    };

    if (addMethod === 'url') {
      if (!newGameUrl) return;
      newGame.url = newGameUrl;
    } else {
      if (!newGameFileContent) return;
      newGame.content = newGameFileContent;
    }

    setGames([...games, newGame]);
    resetForm();
    setIsAddModalOpen(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    if (!newGameName) {
      setNewGameName(file.name.replace(/\.[^/.]+$/, "")); // Auto-fill name without extension
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setNewGameFileContent(event.target.result);
    };
    reader.readAsText(file);
  };

  const resetForm = () => {
    setNewGameName('');
    setNewGameUrl('');
    setNewGameCover('');
    setNewGameFileContent('');
    setFileName('');
    setAddMethod('url');
  };

  const requestRemoveGame = (game, e) => {
    e.stopPropagation();
    setGameToDelete(game);
  };

  const confirmRemoveGame = () => {
    if (gameToDelete) {
      setGames(games.filter(g => g.id !== gameToDelete.id));
      setGameToDelete(null);
    }
  };

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setGames(games.map(g => g.id === id ? { ...g, favorite: !g.favorite } : g));
  };

  // Sort favorites to top, then alphabetical
  const sortedGames = [...games].sort((a, b) => {
    if (a.favorite === b.favorite) return a.name.localeCompare(b.name);
    return a.favorite ? -1 : 1;
  });

  const displayedGames = showFavoritesOnly 
    ? sortedGames.filter(g => g.favorite) 
    : sortedGames;

  // --- Styles for Glassmorphism & Background ---
  const glassPanelClass = "bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-500";
  const inputClass = "w-full bg-black/20 border border-white/10 text-white placeholder-gray-400 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:bg-black/30 hover:border-white/30 transition-all duration-300 shadow-inner";

  return (
    <div className="min-h-screen text-white font-sans overflow-hidden relative">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 z-0 bg-slate-900 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/30 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/30 blur-[150px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full bg-emerald-500/20 blur-[100px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '1s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 md:p-8 flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-4 group cursor-default">
            <div className={`p-4 rounded-[2rem] ${glassPanelClass} bg-gradient-to-br from-purple-500/50 to-blue-500/50 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-purple-500/50`}>
              <Gamepad2 size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 group-hover:from-purple-300 group-hover:to-blue-300 transition-all duration-500">
              VAULT
            </h1>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            {games.length > 0 && (
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`flex items-center gap-2 px-5 py-3.5 rounded-full backdrop-blur-md transition-all duration-500 border hover:-translate-y-1 ${
                  showFavoritesOnly 
                    ? 'bg-red-500/20 border-red-500/50 text-red-300 shadow-[0_8px_20px_rgba(239,68,68,0.4)] scale-105' 
                    : 'bg-white/5 hover:bg-white/15 border-white/10 text-gray-300 hover:text-white hover:shadow-[0_8px_20px_rgba(255,255,255,0.1)]'
                }`}
                title={showFavoritesOnly ? "Showing Favorites" : "Show All"}
              >
                <Heart size={20} fill={showFavoritesOnly ? "currentColor" : "none"} className={`transition-all duration-500 ${showFavoritesOnly ? "text-red-400 scale-110" : "group-hover:scale-110"}`} />
                <span className="font-bold hidden sm:block">Favorites</span>
              </button>
            )}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="group flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-full bg-gradient-to-r from-white/10 to-white/5 hover:from-purple-500/40 hover:to-blue-500/40 border border-white/20 backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 active:scale-95 shadow-[0_8px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_10px_25px_rgba(168,85,247,0.5)]"
            >
              <Plus size={22} className="group-hover:rotate-180 transition-transform duration-700 text-purple-300 group-hover:text-white" />
              <span className="font-bold tracking-wide hidden sm:block text-white">Add Game</span>
            </button>
          </div>
        </header>

        {/* Game Grid / Empty State */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl mx-auto w-full">
          {games.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-80 mt-10 animate-in fade-in zoom-in duration-700">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/20 blur-[50px] rounded-full"></div>
                <Gamepad2 size={100} className="mb-8 text-white/40 animate-bounce" style={{ animationDuration: '3s' }} />
              </div>
              <h2 className="text-3xl font-light mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Your Vault is Empty</h2>
              <p className="text-gray-400 max-w-md text-center text-lg leading-relaxed">
                Click the <strong className="text-purple-300">Add Game</strong> button above to start building your magical web game collection.
              </p>
            </div>
          ) : displayedGames.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-80 mt-10 animate-in fade-in zoom-in duration-700">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/20 blur-[50px] rounded-full"></div>
                <Heart size={100} className="mb-8 text-red-500/40 animate-pulse" style={{ animationDuration: '2s' }} />
              </div>
              <h2 className="text-3xl font-light mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">No Favorites Yet</h2>
              <p className="text-gray-400 max-w-md text-center text-lg leading-relaxed">
                Heart some games to see them magically appear here!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {displayedGames.map((game) => (
                <div
                  key={game.id}
                  onClick={() => setPlayingGame(game)}
                  className={`group relative rounded-[2.5rem] overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_25px_50px_-12px_rgba(147,51,234,0.6)] border border-white/10 hover:border-purple-500/50 bg-white/5 backdrop-blur-xl`}
                >
                  {/* Card Cover Image */}
                  <div className="aspect-[4/3] w-full relative overflow-hidden">
                    <img 
                      src={game.cover} 
                      alt={game.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
                    
                    {/* Top Right Actions (Favorite) */}
                    <div className="absolute top-4 right-4 z-20">
                      <button
                        onClick={(e) => toggleFavorite(game.id, e)}
                        className={`p-3 rounded-full backdrop-blur-xl border transition-all duration-500 hover:scale-125 active:scale-90 ${
                          game.favorite 
                            ? 'bg-red-500/20 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
                            : 'bg-black/40 border-white/10 hover:border-white/30 hover:bg-white/20'
                        }`}
                      >
                        <Heart 
                          size={20} 
                          fill={game.favorite ? "#ef4444" : "none"} 
                          className={`transition-colors duration-300 ${game.favorite ? "text-red-500" : "text-white/70 group-hover:text-white"}`} 
                        />
                      </button>
                    </div>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                      <div className="p-5 rounded-full bg-white/10 backdrop-blur-md transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 ease-out border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.2)] group-hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] group-hover:bg-purple-500/40">
                        <Play fill="white" size={36} className="ml-1 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-6 relative bg-gradient-to-b from-transparent to-black/40">
                    <h3 className="font-bold text-2xl mb-2 truncate group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-blue-300 transition-all duration-300 pr-10">
                      {game.name}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-400 font-medium">
                      <span className="flex items-center gap-1.5 uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/5 group-hover:border-white/20 transition-colors duration-300">
                        {game.type === 'url' ? <LinkIcon size={14} className="text-blue-400" /> : <FileCode size={14} className="text-emerald-400" />}
                        {game.type === 'url' ? 'Web Embed' : 'Local File'}
                      </span>
                    </div>

                    <button 
                      onClick={(e) => requestRemoveGame(game, e)}
                      className="absolute bottom-5 right-5 p-2.5 rounded-full bg-red-500/10 text-red-400/70 hover:bg-red-500 hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.6)] transition-all duration-500 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0"
                      title="Remove game"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* --- Modals --- */}

      {/* Add Game Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl transition-opacity duration-500" onClick={() => setIsAddModalOpen(false)}></div>
          <div className={`relative w-full max-w-md p-8 sm:p-10 rounded-[3rem] ${glassPanelClass} animate-in fade-in zoom-in-95 duration-500 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-white/20`}>
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all duration-300 hover:rotate-90"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-3xl font-black mb-8 flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
              <div className="p-2 rounded-2xl bg-purple-500/20">
                <Plus className="text-purple-400" size={28} /> 
              </div>
              Add to Vault
            </h2>

            <form onSubmit={handleAddGame} className="space-y-6">
              {/* Type Selector */}
              <div className="flex p-1.5 rounded-2xl bg-black/40 border border-white/10 shadow-inner">
                <button
                  type="button"
                  onClick={() => setAddMethod('url')}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${addMethod === 'url' ? 'bg-gradient-to-r from-purple-500/50 to-blue-500/50 shadow-lg text-white scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <LinkIcon size={18} /> Embed URL
                </button>
                <button
                  type="button"
                  onClick={() => setAddMethod('file')}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${addMethod === 'file' ? 'bg-gradient-to-r from-emerald-500/50 to-teal-500/50 shadow-lg text-white scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <FileCode size={18} /> HTML File
                </button>
              </div>

              <div className="group">
                <label className="block text-sm font-bold text-gray-300 mb-2 ml-2 transition-colors group-focus-within:text-purple-400">Game Name</label>
                <input 
                  type="text" 
                  value={newGameName}
                  onChange={(e) => setNewGameName(e.target.value)}
                  placeholder="e.g. Pacman, Asteroids..."
                  className={inputClass}
                  required
                />
              </div>

              {addMethod === 'url' ? (
                <div className="group animate-in fade-in slide-in-from-right-4 duration-300">
                  <label className="block text-sm font-bold text-gray-300 mb-2 ml-2 transition-colors group-focus-within:text-purple-400">Game URL (must allow iframes)</label>
                  <input 
                    type="url" 
                    value={newGameUrl}
                    onChange={(e) => setNewGameUrl(e.target.value)}
                    placeholder="https://example.com/game"
                    className={inputClass}
                    required={addMethod === 'url'}
                  />
                </div>
              ) : (
                <div className="group animate-in fade-in slide-in-from-left-4 duration-300">
                  <label className="block text-sm font-bold text-gray-300 mb-2 ml-2 transition-colors group-focus-within:text-emerald-400">Upload Game (.html)</label>
                  <input 
                    type="file" 
                    accept=".html"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    required={addMethod === 'file'}
                  />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full border-2 border-dashed border-white/10 hover:border-emerald-500/50 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 bg-black/20 text-gray-400 hover:text-white hover:bg-emerald-500/10 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:scale-[1.02]`}
                  >
                    <FileCode size={40} className="mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:text-emerald-400" />
                    <span className="text-base font-bold text-center">
                      {fileName ? <span className="text-emerald-400">{fileName}</span> : 'Click to select an HTML file'}
                    </span>
                    <span className="text-xs mt-2 opacity-60 text-center uppercase tracking-widest">
                      Best for single-file HTML5 games
                    </span>
                  </div>
                </div>
              )}

              <div className="group">
                <label className="block text-sm font-bold text-gray-300 mb-2 ml-2 flex items-center gap-2 transition-colors group-focus-within:text-purple-400">
                  <ImageIcon size={16} /> Cover Image URL (Optional)
                </label>
                <input 
                  type="url" 
                  value={newGameCover}
                  onChange={(e) => setNewGameCover(e.target.value)}
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 mt-4 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 hover:from-purple-500 hover:via-blue-500 hover:to-blue-400 text-white font-black text-lg tracking-widest shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_40px_rgba(147,51,234,0.7)] transition-all duration-500 active:scale-[0.97] hover:-translate-y-1"
              >
                ADD GAME
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {gameToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xl transition-opacity duration-500" onClick={() => setGameToDelete(null)}></div>
          <div className={`relative w-full max-w-sm p-8 rounded-[3rem] ${glassPanelClass} animate-in fade-in zoom-in-95 duration-500 text-center border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.2)]`}>
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-500/10 border border-red-500/20 mb-6 shadow-inner relative">
              <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping opacity-50"></div>
              <AlertCircle className="h-10 w-10 text-red-500 relative z-10" />
            </div>
            <h3 className="text-2xl font-black mb-3 text-white">Delete Game?</h3>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Are you sure you want to remove <br/><span className="font-bold text-white text-lg bg-white/10 px-3 py-1 rounded-lg mt-2 inline-block">"{gameToDelete.name}"</span> <br/>from your Vault? This cannot be undone.
            </p>
            
            <div className="flex gap-4">
              <button
                onClick={() => setGameToDelete(null)}
                className="flex-1 py-3.5 rounded-2xl bg-white/5 hover:bg-white/15 text-white font-bold transition-all duration-300 hover:-translate-y-1"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveGame}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] transition-all duration-300 hover:-translate-y-1 active:scale-[0.97]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Play Game Fullscreen Overlay */}
      {playingGame && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in zoom-in-95 duration-500">
          <div className="flex items-center justify-between p-4 bg-slate-900/90 backdrop-blur-2xl border-b border-white/10 shadow-lg">
            <h2 className="text-xl font-bold text-white flex items-center gap-4">
              <div className="p-2.5 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
                <Gamepad2 size={24} className="text-purple-400" />
              </div>
              <span className="tracking-wide">{playingGame.name}</span>
            </h2>
            <button 
              onClick={() => setPlayingGame(null)}
              className="px-6 py-2.5 bg-white/5 hover:bg-red-500/20 border border-white/5 hover:border-red-500/30 text-gray-300 hover:text-red-400 rounded-full transition-all duration-300 flex items-center gap-2 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:scale-105 active:scale-95 group"
            >
              <X size={20} className="transition-transform duration-300 group-hover:rotate-90" /> 
              <span className="font-bold">Close</span>
            </button>
          </div>
          
          <div className="flex-1 bg-black relative">
            {playingGame.type === 'url' ? (
              <iframe 
                src={playingGame.url} 
                className="absolute inset-0 w-full h-full border-none"
                title={playingGame.name}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                allowFullScreen
              />
            ) : (
              <iframe 
                srcDoc={playingGame.content} 
                className="absolute inset-0 w-full h-full border-none bg-white"
                title={playingGame.name}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                allowFullScreen
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
