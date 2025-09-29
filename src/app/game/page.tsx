'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, GameState, Player } from '@/lib/gameTypes';
import { WizardGameEngine, createWizardGame } from '@/lib/gameEngine';
import { BotAI } from '@/lib/botAI';
import GameTable from '@/components/GameTable';
import PlayerPosition from '@/components/PlayerPosition';
import CardComponent from '@/components/Card';

export default function GamePage() {
  // Game engine state
  const [gameEngine, setGameEngine] = useState<WizardGameEngine | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);

  // Demo: Start a new game
  const startNewGame = () => {
    const config = {
      numberOfPlayers: 4, // Focus on 4 players only
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
    
    // Dynamic seat mapping based on number of players
    const playerCount = gameState.players.length;
    
    if (playerCount === 4) {
      // 4 players: seats 1, 2, 3, 5 (skip 4 and 6)
      switch (position) {
        case 1: return gameState.players[1] || null; // Bot 1 
        case 2: return gameState.players[2] || null; // Bot 2
        case 3: return gameState.players[3] || null; // Bot 3
        case 5: return gameState.players[0] || null; // Human player (bottom center)
        case 4:
        case 6: return null; // Empty seats
        default: return null;
      }
    }
    
    // For other player counts, we'll add logic later
    // For now, default to 4-player mapping
    return null;
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
            /* Game Setup - Center in grid */
            <div 
              style={{ 
                gridArea: '2 / 2 / 3 / 3' // Center - back to coordinates
              }} 
              className="w-full h-full flex items-center justify-center"
            >
              <div className="bg-black/40 backdrop-blur-sm border border-purple-600/30 rounded-xl p-8 max-w-lg">
                <h2 className="text-2xl font-serif text-amber-300 mb-4 text-center">Start a New Game</h2>
                <p className="text-purple-200 mb-6 text-center">
                  Play WIZARD against 3 AI opponents with the complete game engine!
                </p>
                <div className="text-center">
                  <button
                    onClick={startNewGame}
                    className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-bold rounded-lg text-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    🎮 Start Game
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Active Game - All elements as direct grid children */
            <>
              {/* Player Positions - Check all 6 seats */}
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

              {/* LEFT AREA: Game Status Info */}
              <div 
                style={{ 
                  gridArea: '2 / 1 / 3 / 2' // Left area - back to coordinates
                }} 
                className="w-full h-full flex flex-col items-center justify-center gap-1 p-2"
              >
                <div className="bg-black/60 backdrop-blur-sm border border-purple-600/30 rounded-lg p-2 text-center w-full">
                  <div className="text-xs space-y-1">
                    <div className="text-amber-300">Round: {gameState.round}/13</div>
                    <div className="text-purple-300">Phase: {gameState.phase}</div>
                    <div className="text-blue-300">Trump: {gameState.trumpSuit || 'None'}</div>
                    <div className="text-green-300">Turn: {getCurrentPlayerName()}</div>
                  </div>
                </div>
              </div>

              {/* CENTER AREA: Trump Card + Deck + Played Cards Space */}
              <div 
                style={{ 
                  gridArea: '2 / 2 / 3 / 3' // Center area - back to coordinates
                }} 
                className="w-full h-full flex items-center justify-center gap-4 p-2"
              >
                {/* Deck (left) */}
                {gameState.deck && gameState.deck.length > 0 && (
                  <div className="text-center">
                    <div className="text-xs text-amber-300 mb-1">Deck ({gameState.deck.length})</div>
                    <CardComponent
                      card={{ 
                        id: 'deck', 
                        type: 'number', 
                        value: 1, 
                        suit: 'blue',
                        backgroundColor: '#4C1D95',
                        textColor: '#FFFFFF'
                      }}
                      isRevealed={false}
                      className="w-12 h-16"
                    />
                  </div>
                )}

                {/* Played Cards Space (center) */}
                <div className="flex-1 text-center">
                  <div className="text-xs text-gray-400">Played Cards</div>
                  <div className="h-16 border-2 border-dashed border-gray-600 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-500">Cards go here</span>
                  </div>
                </div>

                {/* Trump Card (right) */}
                {gameState.trumpCard && (
                  <div className="text-center">
                    <div className="text-xs text-amber-300 mb-1">Trump</div>
                    <CardComponent
                      card={gameState.trumpCard}
                      isRevealed={true}
                      className="w-12 h-16"
                    />
                  </div>
                )}
              </div>

              {/* RIGHT AREA: Bidding Interface */}
              <div 
                style={{ 
                  gridArea: '2 / 3 / 3 / 4' // Right area - back to coordinates
                }} 
                className="w-full h-full flex flex-col items-center justify-center gap-2 p-2"
              >
                {gameState.phase === 'bidding' && !gameState.players.find(p => p.id === 'human')?.bid && (
                  <div className="bg-black/60 backdrop-blur-sm border border-purple-600/30 rounded-lg p-3 w-full">
                    <h3 className="text-sm font-serif text-amber-300 mb-2 text-center">Make Your Bid</h3>
                    <div className="flex justify-center gap-1 flex-wrap">
                      {Array.from({ length: gameState.round + 1 }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => makeBid(i)}
                          className="px-2 py-1 bg-purple-700 hover:bg-purple-600 text-white font-semibold rounded transition-colors text-xs"
                        >
                          {i}
                        </button>
                      ))}
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
