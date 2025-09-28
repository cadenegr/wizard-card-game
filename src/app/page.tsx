export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-6xl font-serif font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300">
          ✨ WIZARD ✨
        </h1>
        <p className="text-xl text-purple-300 mb-8 font-light">The Ultimate Prediction Card Game</p>
        
        <div className="bg-black/40 backdrop-blur-sm border border-purple-600/30 rounded-xl p-8 max-w-2xl mx-auto">
          <h2 className="text-3xl font-serif text-amber-300 mb-6">Enter the Realm of Magic</h2>
          <p className="text-lg text-purple-200 leading-relaxed mb-8">
            Master the ancient art of prediction and strategy in this enchanting card game.
          </p>
          
          <div className="space-y-4">
            <a 
              href="/game" 
              className="inline-block px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-bold rounded-lg text-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🎴 Enter Game Table
            </a>
            
            <div className="mt-6">
              <a 
                href="/how-to-play"
                className="px-6 py-2 bg-purple-700 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors mr-4"
              >
                📚 How to Play
              </a>
              <button className="px-6 py-2 bg-indigo-700 hover:bg-indigo-600 text-white font-semibold rounded-lg transition-colors">
                🏆 Leaderboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
