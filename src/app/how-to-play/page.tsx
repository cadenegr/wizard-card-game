import Link from 'next/link';

export default function HowToPlayPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white p-8">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-serif font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300">
            📚 How to Play WIZARD
          </h1>
          <p className="text-xl text-amber-200">Learn the Ancient Art of Magical Prediction</p>
          
          {/* Back to Home Button */}
          <div className="mt-4">
            <Link 
              href="/" 
              className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Story Introduction */}
        <div className="bg-black/40 backdrop-blur-sm border border-purple-600/30 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-serif text-amber-300 mb-4">🏛️ The Ancient Origins</h2>
          <p className="text-purple-200 leading-relaxed">
            Long ago in the forgotten times... Apprentices would come from near and far to gather at the famous 
            <strong className="text-amber-200"> Stonehenge Academy of Magic</strong>. There, they would train their magical abilities, 
            sometimes by playing the game Wizard. The English archeologist Hensh Stone, PhD, discovered that Wizard was 
            originally meant to <strong className="text-amber-200">foster the gift of prophecy</strong>.
          </p>
        </div>

        {/* Your Task */}
        <div className="bg-purple-800/30 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-serif text-amber-300 mb-4">🎯 Your Task</h2>
          <p className="text-purple-200 leading-relaxed">
            In this magical card game, you become <strong className="text-amber-200">magicians' apprentices</strong> and 
            try to predict how many tricks you're going to take. At the end of each trick round, you'll earn 
            <strong className="text-amber-200"> experience points</strong> for a correct prediction. The player who has 
            earned the most experience points at the end wins and is celebrated as the 
            <strong className="text-amber-200"> most talented apprentice</strong>.
          </p>
        </div>

        {/* Game Components */}
        <div className="bg-black/40 backdrop-blur-sm border border-purple-600/30 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-serif text-amber-300 mb-4">🎴 Components</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">60 Cards Total:</h3>
              <ul className="text-purple-200 space-y-1">
                <li>• <span className="text-blue-400">4 sets of number cards</span> (1-13 in each color)</li>
                <li>• <span className="text-red-400">Red</span>, <span className="text-blue-400">Blue</span>, <span className="text-yellow-400">Yellow</span>, <span className="text-green-400">Green</span></li>
                <li>• <span className="text-amber-400">4 Wizards</span> (one per color)</li>
                <li>• <span className="text-purple-400">4 Jesters</span> (one per color)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">Players:</h3>
              <ul className="text-purple-200 space-y-1">
                <li>• <span className="text-amber-200">3-6 Apprentices</span></li>
                <li>• <span className="text-amber-200">Ages 10+</span></li>
                <li>• <span className="text-amber-200">~45 minutes</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Game Rounds */}
        <div className="bg-purple-800/30 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-serif text-amber-300 mb-4">🔄 The Trick Round</h2>
          <p className="text-purple-200 mb-4">Each Wizard trick round consists of 4 phases:</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-black/20 rounded-lg p-4">
              <h3 className="text-amber-200 font-semibold mb-2">1. 🎴 Dealing Cards</h3>
              <p className="text-sm text-purple-200">Round 1: 1 card each → Round 2: 2 cards → etc.</p>
            </div>
            <div className="bg-black/20 rounded-lg p-4">
              <h3 className="text-amber-200 font-semibold mb-2">2. 🎯 Predicting Tricks</h3>
              <p className="text-sm text-purple-200">Each player predicts how many tricks they'll win</p>
            </div>
            <div className="bg-black/20 rounded-lg p-4">
              <h3 className="text-amber-200 font-semibold mb-2">3. 🃏 Playing Tricks</h3>
              <p className="text-sm text-purple-200">Follow suit rules, special cards have power</p>
            </div>
            <div className="bg-black/20 rounded-lg p-4">
              <h3 className="text-amber-200 font-semibold mb-2">4. ⭐ Earning Points</h3>
              <p className="text-sm text-purple-200">Correct prediction = 10pts per trick + 20 bonus</p>
            </div>
          </div>
        </div>

        {/* Trump Rules */}
        <div className="bg-black/40 backdrop-blur-sm border border-purple-600/30 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-serif text-amber-300 mb-4">👑 Trump Color</h2>
          <p className="text-purple-200 mb-4">At the start of each round:</p>
          <ul className="text-purple-200 space-y-2">
            <li>• <strong className="text-amber-200">Reveal top card</strong> from remaining deck</li>
            <li>• <strong className="text-blue-400">Number card</strong> → That color becomes trump</li>
            <li>• <strong className="text-yellow-400">Wizard revealed</strong> → Dealer chooses trump color</li>
            <li>• <strong className="text-purple-400">Jester revealed</strong> → No trump color this round</li>
            <li>• <strong className="text-red-400">Trump cards beat all other colors</strong></li>
          </ul>
        </div>

        {/* Special Cards */}
        <div className="bg-purple-800/30 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-serif text-amber-300 mb-4">✨ Special Cards</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-black/20 rounded-lg p-4">
              <h3 className="text-yellow-400 font-semibold mb-2 text-xl">🧙‍♂️ Wizards</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Always win the trick</strong></li>
                <li>• Can be played anytime</li>
                <li>• First Wizard played wins if multiple</li>
                <li>• When leading: others can play any card</li>
              </ul>
            </div>
            <div className="bg-black/20 rounded-lg p-4">
              <h3 className="text-purple-400 font-semibold mb-2 text-xl">🃏 Jesters</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Always lose the trick</strong></li>
                <li>• Can be played anytime</li>
                <li>• Exception: If only Jesters → first wins</li>
                <li>• When leading: next number card sets suit</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Playing Rules */}
        <div className="bg-black/40 backdrop-blur-sm border border-purple-600/30 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-serif text-amber-300 mb-4">🎮 Playing Tricks</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-yellow-400 font-semibold mb-2">🎯 Who Wins a Trick?</h3>
              <ol className="text-purple-200 space-y-1 list-decimal list-inside">
                <li><strong className="text-amber-200">First Wizard played</strong> wins the trick</li>
                <li>If no Wizards: <strong className="text-red-400">Highest trump card</strong> wins</li>
                <li>If no Wizards or trumps: <strong className="text-blue-400">Highest card of led suit</strong> wins</li>
              </ol>
            </div>
            
            <div>
              <h3 className="text-yellow-400 font-semibold mb-2">📋 Following Suit Rules</h3>
              <ul className="text-purple-200 space-y-1">
                <li>• <strong className="text-amber-200">First player</strong>: Can play any card</li>
                <li>• <strong className="text-blue-400">Other players</strong>: Must follow suit if possible</li>
                <li>• <strong className="text-green-400">No cards of led suit?</strong> Play any card (trump, other colors)</li>
                <li>• <strong className="text-purple-400">Wizards & Jesters</strong>: Can always be played</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Scoring */}
        <div className="bg-purple-800/30 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-serif text-amber-300 mb-4">⭐ Scoring</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-900/20 rounded-lg p-4 border border-green-600/30">
              <h3 className="text-green-400 font-semibold mb-2">✅ Correct Prediction</h3>
              <p className="text-green-200 font-bold text-lg">10 points per trick + 20 bonus points</p>
              <p className="text-green-300 text-sm mt-1">Example: Predicted 3, won 3 = 50 points (30+20)</p>
            </div>
            <div className="bg-red-900/20 rounded-lg p-4 border border-red-600/30">
              <h3 className="text-red-400 font-semibold mb-2">❌ Wrong Prediction</h3>
              <p className="text-red-200 font-bold text-lg">Lose 10 points per trick difference</p>
              <p className="text-red-300 text-sm mt-1">Example: Predicted 2, won 4 = -20 points</p>
            </div>
          </div>
        </div>

        {/* Game End */}
        <div className="bg-black/40 backdrop-blur-sm border border-purple-600/30 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-serif text-amber-300 mb-4">🏆 End of Game</h2>
          <div className="text-purple-200 space-y-2">
            <p>The game ends when all cards are dealt in the final round:</p>
            <ul className="space-y-1 ml-4">
              <li>• <strong className="text-amber-200">6 players</strong> → 10 rounds</li>
              <li>• <strong className="text-amber-200">5 players</strong> → 12 rounds</li>
              <li>• <strong className="text-amber-200">4 players</strong> → 15 rounds</li>
              <li>• <strong className="text-amber-200">3 players</strong> → 20 rounds</li>
            </ul>
            <p className="pt-4"><strong className="text-yellow-400">The apprentice with the most experience points wins!</strong></p>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="bg-purple-800/30 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-serif text-amber-300 mb-4">⚡ Quick Reference</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h3 className="text-yellow-400 font-semibold mb-2">Card Hierarchy</h3>
              <p className="text-purple-200">Wizard &gt; Trump &gt; Led Suit &gt; Other</p>
            </div>
            <div>
              <h3 className="text-yellow-400 font-semibold mb-2">Special Cards</h3>
              <p className="text-purple-200">🧙‍♂️ Always wins<br/>🃏 Always loses</p>
            </div>
            <div>
              <h3 className="text-yellow-400 font-semibold mb-2">Scoring</h3>
              <p className="text-purple-200">Exact = 10×tricks + 20<br/>Wrong = -10×difference</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="text-center space-y-4">
          <a 
            href="/game" 
            className="inline-block px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-bold rounded-lg text-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            🎴 Ready to Play!
          </a>
          
          <div>
            <Link 
              href="/" 
              className="px-6 py-2 bg-purple-700 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}