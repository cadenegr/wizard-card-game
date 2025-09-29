'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, GameState, Player } from '@/lib/gameTypes';
import { WizardGameEngine, createWizardGame } from '@/lib/gameEngine';
import { BotAI } from '@/lib/botAI';
import CardComponent from '@/components/Card';
import GameTable from '@/components/GameTable';
import PlayerPosition from '@/components/PlayerPosition';

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
      
      // After all bids, process any bot moves in playing phase
      if (currentState.phase === 'playing') {
        currentState = gameEngine.processBotMoves();
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
      let updatedState = gameEngine.playCard('human', cardId);
      
      // Process any pending bot moves
      updatedState = gameEngine.processBotMoves();
      
      setGameState(updatedState);
    } catch (error) {
      console.error('Play error:', error);
    }
  };

  const getPlayerAtPosition = (position: 1 | 2 | 3 | 4 | 5 | 6): Player | null => {
    if (!gameState) return null;
    
    // Player 5 is always the human player
    // Other positions are filled by bots in order
    switch (position) {
      case 1: return gameState.players[1] || null; // Bot 1
      case 2: return gameState.players[2] || null; // Bot 2  
      case 3: return gameState.players[3] || null; // Bot 3
      case 4: return gameState.players.length > 4 ? gameState.players[4] : null; // Bot 4 (if 5+ players)
      case 5: return gameState.players[0] || null; // Human player (always first in array)
      case 6: return gameState.players.length > 5 ? gameState.players[5] : null; // Bot 5 (if 6 players)
      default: return null;
    }
  };

  const getCurrentPlayerName = (): string => {
    if (!gameState) return '';
    return gameState.players[gameState.currentPlayerIndex]?.name || '';
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
            <>
              {/* Player Positions on Table */}
              {[1, 2, 3, 4, 5, 6].map(position => {
                const player = getPlayerAtPosition(position as 1 | 2 | 3 | 4 | 5 | 6);
                if (!player) return null;
                
                const isHuman = player.id === 'human';
                const isCurrent = gameState.players[gameState.currentPlayerIndex]?.id === player.id;
                const canPlay = gameState.phase === 'playing' && isCurrent && isHuman;
                
                return (
                  <PlayerPosition
                    key={position}
                    player={player}
                    position={position as 1 | 2 | 3 | 4 | 5 | 6}
                    isCurrentPlayer={isCurrent}
                    isHumanPlayer={isHuman}
                    onCardPlay={playCard}
                    canPlayCards={canPlay}
                  />
                );
              })}

              {/* Center Game Info */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                {/* Game Status */}
                <div className="bg-black/60 backdrop-blur-sm border border-purple-600/30 rounded-xl p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
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
                      Turn: {getCurrentPlayerName()}
                    </div>
                  </div>
                </div>

                {/* Trump Card Display */}
                {gameState.trumpCard && (
                  <div className="mb-4">
                    <div className="text-sm text-amber-300 mb-2">Trump Card</div>
                    <CardComponent
                      card={gameState.trumpCard}
                      isRevealed={true}
                      className="w-16 h-20 mx-auto"
                    />
                  </div>
                )}

                {/* Bidding Interface */}
                {gameState.phase === 'bidding' && !gameState.players.find(p => p.id === 'human')?.bid && (
                  <div className="bg-black/60 backdrop-blur-sm border border-purple-600/30 rounded-xl p-6">
                    <h3 className="text-lg font-serif text-amber-300 mb-4">Make Your Bid</h3>
                    <p className="text-purple-200 mb-4 text-sm">
                      How many tricks do you think you can win?
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {Array.from({ length: gameState.round + 1 }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => makeBid(i)}
                          className="px-3 py-1 bg-purple-700 hover:bg-purple-600 text-white font-semibold rounded transition-colors text-sm"
                        >
                          {i}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Playing Phase Info */}
                {gameState.phase === 'playing' && (
                  <div className="bg-black/60 backdrop-blur-sm border border-purple-600/30 rounded-xl p-4">
                    <div className="text-amber-300 text-sm">
                      {gameState.players[gameState.currentPlayerIndex]?.id === 'human' 
                        ? 'Your turn - click a card to play' 
                        : `${getCurrentPlayerName()}'s turn`}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </GameTable>

        {/* New Game Button - Outside table, bottom right */}
        {gameState && (
          <div className="fixed bottom-8 right-8">
            <button
              onClick={startNewGame}
              className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors shadow-lg"
            >
              🔄 New Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
