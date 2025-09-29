'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, GameState, Player } from '@/lib/gameTypes';
import { WizardGameEngine, createWizardGame } from '@/lib/gameEngine';
import { BotAI } from '@/lib/botAI';
import CardComponent from '@/components/Card';
import GameTable from '@/components/GameTable';

export default function GamePage() {
  // Game engine state
  const [gameEngine, setGameEngine] = useState<WizardGameEngine | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);

  // Demo: Start a new game
  const startNewGame = () => {
    const config = {
      numberOfPlayers: 4,
      numberOfBots: 3,
      botDifficulties: ['easy', 'medium', 'hard'] as ('easy' | 'medium' | 'hard')[],
      playerName: 'You'
    };

    const newGame = createWizardGame(config);
    const initialState = newGame.startRound();
    
    console.log('Game started, phase:', initialState.phase); // Debug log
    
    setGameEngine(newGame);
    setGameState(initialState);
  };

  // Demo: Make a bid for human player
  const makeBid = (bidAmount: number) => {
    if (!gameEngine) return;
    
    // Get fresh state from game engine
    const freshState = gameEngine.getGameState();
    console.log('Making bid:', bidAmount, 'Fresh engine phase:', freshState.phase); // Debug log
    
    try {
      const updatedState = gameEngine.makeBid('human', bidAmount);
      
      // Auto-play bot bids
      let currentState = updatedState;
      for (const player of currentState.players) {
        if (player.type === 'bot' && player.bid === null) {
          const botDecision = BotAI.makeDecision(player, currentState, 'bid');
          if (botDecision.bid !== undefined) {
            currentState = gameEngine.makeBid(player.id, botDecision.bid);
          }
        }
      }
      
      setGameState(currentState);
    } catch (error) {
      console.error('Bid error:', error);
      console.error('Game engine internal state:', gameEngine.getGameState());
    }
  };

  // Demo: Play a card
  const playCard = (cardId: string) => {
    if (!gameEngine) return;
    
    try {
      const updatedState = gameEngine.playCard('human', cardId);
      setGameState(updatedState);
    } catch (error) {
      console.error('Play error:', error);
    }
  };

  const getHumanPlayer = (): Player | null => {
    return gameState?.players.find(p => p.id === 'human') || null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300 mb-4">
            🎴 WIZARD Game Engine Demo
          </h1>
          
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

        <GameTable>
          {!gameState ? (
            /* Game Setup */
            <div className="text-center py-16">
              <div className="bg-black/40 backdrop-blur-sm border border-purple-600/30 rounded-xl p-8 max-w-lg mx-auto">
                <h2 className="text-2xl font-serif text-amber-300 mb-4">Start a New Game</h2>
                <p className="text-purple-200 mb-6">
                  Play WIZARD against 3 AI opponents with the complete game engine!
                </p>
                <button
                  onClick={startNewGame}
                  className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-bold rounded-lg text-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  🎮 Start Game
                </button>
              </div>
            </div>
          ) : (
            /* Active Game */
            <div className="space-y-6">
              {/* Game Status */}
              <div className="text-center">
                <div className="bg-black/40 backdrop-blur-sm border border-purple-600/30 rounded-xl p-4">
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="text-amber-300">
                      Round: {gameState.round}/13
                    </div>
                    <div className="text-purple-300">
                      Phase: {gameState.phase}
                    </div>
                    <div className="text-blue-300">
                      Trump: {gameState.trumpSuit || 'None'}
                    </div>
                    <div className="text-green-300">
                      Players: {gameState.numberOfPlayers}
                    </div>
                  </div>
                </div>
              </div>

              {/* Players Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {gameState.players.map((player, index) => (
                  <div key={player.id} className="bg-black/30 rounded-lg p-3 border border-purple-600/20">
                    <div className="text-center">
                      <div className={`font-semibold ${player.type === 'human' ? 'text-yellow-300' : 'text-blue-300'}`}>
                        {player.name}
                      </div>
                      <div className="text-xs text-gray-300">
                        Cards: {player.cards.length}
                      </div>
                      <div className="text-xs text-gray-300">
                        Bid: {player.bid ?? 'None'}
                      </div>
                      <div className="text-xs text-gray-300">
                        Tricks: {player.tricksWon}
                      </div>
                      <div className="text-xs text-gray-300">
                        Score: {player.totalScore}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bidding Phase */}
              {gameState.phase === 'bidding' && !gameState.bids['human'] && (
                <div className="text-center">
                  <div className="bg-black/40 backdrop-blur-sm border border-purple-600/30 rounded-xl p-6 max-w-lg mx-auto">
                    <h3 className="text-xl font-serif text-amber-300 mb-4">Make Your Bid</h3>
                    <p className="text-purple-200 mb-4">
                      How many tricks do you think you can win this round?
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {Array.from({ length: gameState.round + 1 }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => makeBid(i)}
                          className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors"
                        >
                          {i}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Player Hand */}
              {getHumanPlayer() && (
                <div className="text-center">
                  <h3 className="text-lg font-serif text-amber-300 mb-4">Your Hand</h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {getHumanPlayer()!.cards.map((card: Card, index: number) => (
                      <div
                        key={card.id}
                        onClick={() => gameState.phase === 'playing' && gameEngine?.isPlayerTurn('human') ? playCard(card.id) : null}
                        className={gameState.phase === 'playing' && gameEngine?.isPlayerTurn('human') ? 'cursor-pointer' : ''}
                      >
                        <CardComponent
                          card={card}
                          isRevealed={true}
                          className={gameState.phase === 'playing' && gameEngine?.isPlayerTurn('human') ? 'hover:scale-105' : ''}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trump Card Display */}
              {gameState.trumpCard && (
                <div className="text-center">
                  <h3 className="text-lg font-serif text-amber-300 mb-4">Trump Card</h3>
                  <div className="flex justify-center">
                    <CardComponent
                      card={gameState.trumpCard}
                      isRevealed={true}
                    />
                  </div>
                </div>
              )}

              {/* Reset Game */}
              <div className="text-center">
                <button
                  onClick={startNewGame}
                  className="px-6 py-2 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
                >
                  🔄 New Game
                </button>
              </div>
            </div>
          )}
        </GameTable>
      </div>
    </div>
  );
}
