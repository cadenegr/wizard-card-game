'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GameState, Player, Card } from '@/lib/gameTypes';
import { WizardGameEngine, createWizardGame } from '@/lib/gameEngine';
import { BotAI } from '@/lib/botAI';
import GameTable from '@/components/GameTable';
import PlayerPosition from '@/components/PlayerPosition';
import CardComponent from '@/components/Card';

export default function GamePage() {
  // CONFIGURATION-DRIVEN: Clockwise seating with seat-based bot names
  // Clockwise Layout: [1][2][3]  (top row) 
  //                   [6][5][4]  (bottom row - visual clockwise: 1→2→3→4→5→6→1)
  // Turn order determined dynamically by pregame winner, seats are just visual positions
  const PLAYER_CONFIGS = {
    3: { 
      seats: [1, 2, 5] as (1 | 2 | 3 | 4 | 5 | 6)[],  
      botNames: ['Bot 1', 'Bot 2'] as string[], // Bot names match seat numbers
      numberOfBots: 2,
      maxRounds: 20  
    },
    4: { 
      seats: [1, 2, 4, 5] as (1 | 2 | 3 | 4 | 5 | 6)[], 
      botNames: ['Bot 1', 'Bot 2', 'Bot 4'] as string[], // Bot names match seat numbers
      numberOfBots: 3,
      maxRounds: 15  
    },
    5: { 
      seats: [1, 2, 3, 4, 5] as (1 | 2 | 3 | 4 | 5 | 6)[], 
      botNames: ['Bot 1', 'Bot 2', 'Bot 3', 'Bot 4'] as string[], // Bot names match seat numbers
      numberOfBots: 4,
      maxRounds: 12  
    },
    6: { 
      seats: [1, 2, 3, 4, 5, 6] as (1 | 2 | 3 | 4 | 5 | 6)[], 
      botNames: ['Bot 1', 'Bot 2', 'Bot 3', 'Bot 4', 'Bot 6'] as string[], // Bot names match seat numbers
      numberOfBots: 5,
      maxRounds: 10  
    }
  };

  // Game engine state
  const [gameEngine, setGameEngine] = useState<WizardGameEngine | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  
  // Player selection state
  const [selectedPlayerCount, setSelectedPlayerCount] = useState<3 | 4 | 5 | 6 | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  // Auto-continue from pregame result to bidding after 2 seconds
  useEffect(() => {
    if (gameState?.phase === 'pregame-result' && gameState.turnOrderWinner) {
      const timer = setTimeout(() => {
        continueToBidding();
      }, 3500);
      
      return () => clearTimeout(timer);
    }
  }, [gameState?.phase, gameState?.turnOrderWinner]);

  // Auto-continue from trick-complete to next trick after 3 seconds
  useEffect(() => {
    if (gameState?.phase === 'trick-complete' && gameEngine) {
      const timer = setTimeout(() => {
        const updatedState = gameEngine.continueAfterTrick();
        setGameState(updatedState);
        
        // If still in playing phase, continue bot sequence
        if (updatedState.phase === 'playing') {
          setTimeout(() => {
            processBotPlaying(updatedState);
          }, 500);
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [gameState?.phase, gameEngine]);

  // Demo: Start a new game with selected player count
  const startNewGame = () => {
    if (!selectedPlayerCount) return; // Can't start without selection
    
    const config = PLAYER_CONFIGS[selectedPlayerCount];
    
    // CLOCKWISE PLAYER CREATION: Create players in clockwise seat order
    // This ensures game engine's currentPlayerIndex follows clockwise progression
    const clockwiseSeats = config.seats; // Already in clockwise order: [1,2,3,4,5,6]
    
    // Create bot names for non-human seats
    const botSeats = clockwiseSeats.filter(seat => seat !== 5);
    const seatBasedBotNames = botSeats.map(seat => `Bot ${seat}`);
    
    // Create players in clockwise seat order for the game engine
    const clockwisePlayers: { name: string; type: 'human' | 'bot' }[] = [];
    
    clockwiseSeats.forEach(seat => {
      if (seat === 5) {
        // Human player
        clockwisePlayers.push({ name: 'You', type: 'human' });
      } else {
        // Bot player
        clockwisePlayers.push({ name: `Bot ${seat}`, type: 'bot' });
      }
    });
    
    const gameConfig = {
      numberOfPlayers: selectedPlayerCount,
      numberOfBots: config.numberOfBots,
      botDifficulties: seatBasedBotNames.map(() => 'medium') as ('easy' | 'medium' | 'hard')[],
      playerName: 'You',
      seatConfiguration: config.seats,
      botNames: seatBasedBotNames,
      maxRounds: config.maxRounds,
      clockwisePlayers: clockwisePlayers // Pass clockwise player order
    };

    const newGame = createWizardGame(gameConfig);
    const initialState = newGame.startRound();
    
    console.log('Game started with', selectedPlayerCount, 'players, phase:', initialState.phase);
    console.log('Clockwise player order:', clockwisePlayers);
    console.log('Active seats:', config.seats);
    
    setGameEngine(newGame);
    setGameState(initialState);
    setGameStarted(true);
  };
  
  // Reset to player selection
  const resetToPlayerSelection = () => {
    setGameEngine(null);
    setGameState(null);
    setSelectedPlayerCount(null);
    setGameStarted(false);
  };

  // Continue to bidding after pregame turn order
  const continueToBidding = () => {
    if (!gameEngine) return;
    const updatedState = gameEngine.continueToBidding();
    setGameState(updatedState);
    
    // Start bot bidding sequence if the first player is a bot
    setTimeout(() => {
      processBotBidding(updatedState);
    }, 1000);
  };

  // Process bot bidding turns in sequence
  const processBotBidding = (currentState: GameState) => {
    const currentPlayer = currentState.players[currentState.currentPlayerIndex];
    
    if (currentPlayer.type === 'bot' && currentState.phase === 'bidding' && currentPlayer.bid === null) {
      setTimeout(() => {
        if (!gameEngine) return;
        
        // Bot makes a bid based on their cards and round number
        const maxBid = currentState.round;
        const botBid = Math.floor(Math.random() * (maxBid + 1)); // Simple random bid for now
        
        const updatedState = gameEngine.makeBid(currentPlayer.id, botBid);
        setGameState(updatedState);
        
        // Continue to next player if bidding isn't complete
        if (!updatedState.biddingComplete) {
          processBotBidding(updatedState);
        } else {
          // Bidding complete, start playing phase with bot moves
          setTimeout(() => {
            processBotPlaying(updatedState);
          }, 1000);
        }
      }, 1500); // 1.5 second delay between bot bids
    }
  };

  // Process bot playing turns in sequence
  const processBotPlaying = (currentState: GameState) => {
    console.log('=== processBotPlaying DEBUG ===');
    console.log('Phase:', currentState.phase);
    console.log('Current player index:', currentState.currentPlayerIndex);
    console.log('Current player:', currentState.players[currentState.currentPlayerIndex]?.name, currentState.players[currentState.currentPlayerIndex]?.type);
    console.log('All players:', currentState.players.map(p => `${p.name}(${p.type})`));
    console.log('Current trick cards:', currentState.currentTrick?.cardsPlayed?.length || 0);
    
    const currentPlayer = currentState.players[currentState.currentPlayerIndex];
    
    if (!currentPlayer) {
      console.log('ERROR: No current player found at index', currentState.currentPlayerIndex);
      return;
    }
    
    if (currentPlayer.type === 'bot' && currentState.phase === 'playing') {
      console.log(`${currentPlayer.name} should play a card...`);
      
      setTimeout(() => {
        if (!gameEngine) {
          console.log('ERROR: No game engine available');
          return;
        }
        
        // Bot plays a random valid card
        const availableCards = currentPlayer.cards;
        console.log(`${currentPlayer.name} has ${availableCards.length} cards available:`, availableCards.map(c => `${c.type}-${c.value}`));
        
        if (availableCards.length > 0) {
          const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
          console.log(`${currentPlayer.name} attempting to play:`, randomCard);
          
          try {
            const updatedState = gameEngine.playCard(currentPlayer.id, randomCard.id);
            console.log('✅ Card played successfully. New phase:', updatedState.phase);
            console.log('New current player:', updatedState.players[updatedState.currentPlayerIndex]?.name);
            setGameState(updatedState);
            
            // Continue with next player if still in playing phase
            if (updatedState.phase === 'playing') {
              processBotPlaying(updatedState);
            }
          } catch (error) {
            console.log('❌ Error playing card:', error);
          }
        } else {
          console.log(`${currentPlayer.name} has no cards to play!`);
        }
      }, 2000); // 2 second delay between bot plays
    } else {
      console.log('Bot playing stopped - Current player:', currentPlayer?.name, 'Type:', currentPlayer?.type, 'Phase:', currentState.phase);
    }
  };

  // Make a bid for human player
  const makeBid = (bidAmount: number) => {
    if (!gameEngine || !gameState) return;
    
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer.id !== 'human') {
      console.log('Not human player turn');
      return;
    }
    
    try {
      const updatedState = gameEngine.makeBid('human', bidAmount);
      setGameState(updatedState);
      
      // Continue bot bidding sequence after human bid
      if (!updatedState.biddingComplete) {
        setTimeout(() => {
          processBotBidding(updatedState);
        }, 500);
      }
    } catch (error) {
      console.error('Error making bid:', error);
    }
  };

  // Play a card
  const playCard = (cardId: string) => {
    if (!gameEngine || !gameState) return;
    
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer.id !== 'human') {
      console.log('Not human player turn');
      return;
    }
    
    try {
      const updatedState = gameEngine.playCard('human', cardId);
      setGameState(updatedState);
      
      // Continue bot playing sequence after human plays
      if (updatedState.phase === 'playing') {
        setTimeout(() => {
          processBotPlaying(updatedState);
        }, 500);
      }
    } catch (error) {
      console.error('Play error:', error);
    }
  };

  const getPlayerAtPosition = (position: 1 | 2 | 3 | 4 | 5 | 6): Player | null => {
    if (!gameState || !selectedPlayerCount) return null;
    
    const config = PLAYER_CONFIGS[selectedPlayerCount];
    const activeSeats = config.seats;
    
    // Check if this position has a player
    if (!activeSeats.includes(position)) {
      return null; // Empty seat
    }
    
    // CLOCKWISE MAPPING: Players array is already in clockwise seat order
    // Find the index of this seat in the clockwise seats array
    const seatIndex = activeSeats.indexOf(position);
    if (seatIndex >= 0 && seatIndex < gameState.players.length) {
      return gameState.players[seatIndex];
    }
    
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
          {!gameStarted || !gameState ? (
            /* Player Selection UI - Center in grid */
            <div 
              style={{ 
                gridArea: '2 / 2 / 3 / 3' // Center - back to coordinates
              }} 
              className="w-full h-full flex items-center justify-center"
            >
              <div className="bg-black/40 backdrop-blur-sm border border-purple-600/30 rounded-xl p-6 max-w-md w-full">
                <h2 className="text-xl font-serif text-amber-300 mb-3 text-center">
                  Select Number of Players
                </h2>
                <p className="text-purple-200 mb-4 text-center text-sm">
                  Choose how many players will join this WIZARD game
                </p>
                
                {/* Player Count Selection Buttons - Compact Grid */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[3, 4, 5, 6].map(count => (
                    <button
                      key={count}
                      onClick={() => setSelectedPlayerCount(count as 3 | 4 | 5 | 6)}
                      className={`px-4 py-3 rounded-lg font-bold text-lg transition-all duration-200 ${
                        selectedPlayerCount === count
                          ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black shadow-lg scale-105'
                          : 'bg-purple-700/50 hover:bg-purple-600/70 text-white border border-purple-500'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
                
                {/* Start Game Button - Only enabled when player count selected */}
                <div className="text-center">
                  <button
                    onClick={startNewGame}
                    disabled={!selectedPlayerCount}
                    className={`px-6 py-3 rounded-lg text-lg font-bold transition-all duration-200 ${
                      selectedPlayerCount
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    🎮 Start Game
                  </button>
                </div>
                
                {selectedPlayerCount && (
                  <div className="mt-3 text-center text-xs text-purple-300">
                    You will face {selectedPlayerCount - 1} AI opponents
                  </div>
                )}
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
                
                // Find pregame card for this player (during pregame phases)
                const pregameCard = (gameState.phase === 'pregame' || gameState.phase === 'pregame-result') 
                  ? gameState.pregameCards?.[player.id]?.[0] // Get first card for this player
                  : undefined;
                
                // Get player's bid if they've made one
                const playerBid = gameState.bids?.[player.id] ?? null;
                
                // Check if it's currently human's turn to play
                const currentPlayer = gameState.players[gameState.currentPlayerIndex];
                const isHumanTurn = currentPlayer?.id === 'human' && gameState.phase === 'playing';
                
                return (
                  <PlayerPosition
                    key={position}
                    player={player}
                    position={position as 1 | 2 | 3 | 4 | 5 | 6}
                    isCurrentPlayer={isCurrent}
                    isHumanPlayer={isHuman}
                    onCardPlay={playCard}
                    canPlayCards={canPlay}
                    pregameCard={pregameCard}
                    gamePhase={gameState.phase}
                    playerBid={playerBid}
                    isHumanTurn={isHumanTurn}
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
                    <div className="text-amber-300">Round: {gameState.round}/{selectedPlayerCount ? PLAYER_CONFIGS[selectedPlayerCount].maxRounds : '?'}</div>
                    <div className="text-purple-300">Phase: {gameState.phase}</div>
                    <div className="text-blue-300">Trump: {gameState.trumpSuit || 'None'}</div>
                    <div className="text-green-300">Turn: {getCurrentPlayerName()}</div>
                  </div>
                </div>
              </div>

              {/* CENTER AREA: Phase-specific Content */}
              <div 
                style={{ 
                  gridArea: '2 / 2 / 3 / 3' // Center area - back to coordinates
                }} 
                className="w-full h-full flex items-center justify-center gap-4 p-2"
              >
                {/* PREGAME: Turn order in progress */}
                {gameState.phase === 'pregame' && (
                  <div className="text-center">
                    <div className="text-amber-300 font-serif">
                      Determining Turn Order...
                    </div>
                    <div className="text-xs text-purple-200 mt-1">
                      Highest card goes first
                    </div>
                  </div>
                )}

                {/* BIDDING: Show trump card prominently */}
                {gameState.phase === 'bidding' && (
                  <div className="text-center">
                    <div className="text-amber-300 font-serif mb-3 text-lg">Trump Card</div>
                    {gameState.trumpCard ? (
                      <CardComponent
                        card={gameState.trumpCard}
                        isRevealed={true}
                        className="w-16 h-24 mx-auto"
                      />
                    ) : (
                      <div className="text-gray-400 text-sm">No Trump This Round</div>
                    )}
                    <div className="text-xs text-purple-200 mt-2">
                      Round {gameState.round} - {gameState.round} card{gameState.round === 1 ? '' : 's'} each
                    </div>
                  </div>
                )}

                {/* PLAYING: Show deck with trump on top and played cards area */}
                {gameState.phase === 'playing' && (
                  <>
                    {/* Left: Deck with Trump Card on top */}
                    <div className="text-center relative">
                      <div className="text-xs text-amber-300 mb-1">Deck ({gameState.deck.length})</div>
                      <div className="relative">
                        {/* Deck (bottom layer) */}
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
                        {/* Trump Card (top layer) */}
                        {gameState.trumpCard && (
                          <div className="absolute -top-1 -right-1 z-10">
                            <div className="text-xs text-amber-300 mb-1 text-center">Trump</div>
                            <CardComponent
                              card={gameState.trumpCard}
                              isRevealed={true}
                              className="w-10 h-14"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Center: Played Cards Area with overlapping display */}
                    <div className="flex-1 flex items-center justify-center">
                      <div className="relative flex justify-center items-center" style={{ width: '200px', height: '80px' }}>
                        {(() => {
                          // Show cards from current trick OR last completed trick if in trick-complete phase
                          let cardsToShow: { playerId: string; card: Card }[] = [];
                          
                          if (gameState.phase === 'trick-complete' as any) {
                            // During trick-complete phase, prioritize currentTrick (which has the last cards)
                            // If currentTrick is null, fall back to completed tricks
                            if (gameState.currentTrick?.cardsPlayed) {
                              cardsToShow = gameState.currentTrick.cardsPlayed;
                              console.log('Showing current trick cards during trick-complete:', cardsToShow.length);
                            } else if (gameState.completedTricks.length > 0) {
                              cardsToShow = gameState.completedTricks[gameState.completedTricks.length - 1].cardsPlayed || [];
                              console.log('Showing completed trick cards during trick-complete:', cardsToShow.length);
                            }
                          } else if (gameState.currentTrick?.cardsPlayed) {
                            // Show current trick in progress
                            cardsToShow = gameState.currentTrick.cardsPlayed;
                          }

                          console.log('Cards to show:', cardsToShow.length, 'Phase:', gameState.phase);

                          if (cardsToShow.length > 0) {
                            return cardsToShow.map((play, index) => {
                              const offsetX = index * 25; // 25px offset for better visibility with full size cards
                              const maxWidth = 150; // Maximum spread width
                              const actualOffsetX = Math.min(offsetX, maxWidth);
                              
                              return (
                                <div 
                                  key={`${play.playerId}-${index}`}
                                  className="absolute flex flex-col items-center"
                                  style={{ 
                                    left: `${actualOffsetX}px`,
                                    zIndex: index + 1
                                  }}
                                >
                                  <div className="text-xs text-gray-300 mb-1 whitespace-nowrap">
                                    {gameState.players.find(p => p.id === play.playerId)?.name || 'Player'}
                                  </div>
                                  <CardComponent
                                    card={play.card}
                                    isRevealed={true}
                                    className="w-12 h-16"
                                    overlapping={true}
                                  />
                                </div>
                              );
                            });
                          }
                          return null;
                        })()}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* RIGHT AREA: Phase-specific Interface */}
              <div 
                style={{ 
                  gridArea: '2 / 3 / 3 / 4' // Right area - back to coordinates
                }} 
                className="w-full h-full flex flex-col items-center justify-center gap-2 p-2"
              >
                {/* PREGAME: Turn Order Determination */}
                {gameState.phase === 'pregame' && (
                  <div className="bg-black/60 backdrop-blur-sm border border-purple-600/30 rounded-lg p-3 w-full">
                    <h3 className="text-sm font-serif text-amber-300 mb-2 text-center">Turn Order</h3>
                    <p className="text-xs text-purple-200 text-center">
                      Dealing cards to determine who goes first...
                    </p>
                    <div className="text-center mt-2">
                      <div className="text-xs text-gray-300">Highest card wins!</div>
                    </div>
                  </div>
                )}

                {/* PREGAME RESULT: Winner Announcement */}
                {gameState.phase === 'pregame-result' && gameState.turnOrderWinner && (
                  <div className="bg-black/60 backdrop-blur-sm border border-green-600/30 rounded-lg p-3 w-full">
                    <p className="text-lg text-green-300 text-center font-semibold">
                      {gameState.players.find(p => p.id === gameState.turnOrderWinner)?.name || 'Player'} goes first!
                    </p>
                  </div>
                )}

                {/* BIDDING: Enhanced bidding interface */}
                {gameState.phase === 'bidding' && (() => {
                  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
                  const isHumanTurn = currentPlayer.id === 'human';
                  const humanPlayer = gameState.players.find(p => p.id === 'human');
                  const humanHasBid = humanPlayer?.bid !== null;
                  
                  if (isHumanTurn && !humanHasBid) {
                    // Human's turn to bid
                    return (
                      <div className="bg-black/60 backdrop-blur-sm border border-purple-600/30 rounded-lg p-3 w-full">
                        <h3 className="text-sm font-serif text-amber-300 mb-2 text-center">Your Bid</h3>
                        <div className="text-xs text-gray-300 mb-3 text-center">
                          Choose 0 to {gameState.round} tricks
                        </div>
                        <div className="flex justify-center gap-1 flex-wrap">
                          {Array.from({ length: gameState.round + 1 }, (_, i) => (
                            <button
                              key={i}
                              onClick={() => makeBid(i)}
                              className="px-3 py-2 bg-purple-700 hover:bg-purple-600 text-white font-semibold rounded transition-colors text-sm"
                            >
                              {i}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  } else {
                    // Show bidding status
                    return (
                      <div className="bg-black/60 backdrop-blur-sm border border-amber-600/30 rounded-lg p-3 w-full">
                        <h3 className="text-sm font-serif text-amber-300 mb-2 text-center">Bidding Phase</h3>
                        <div className="text-xs text-gray-300 text-center mb-2">
                          Round {gameState.round}
                        </div>
                        <div className="text-xs text-purple-200 text-center">
                          {humanHasBid ? 'Waiting for other players...' : `${currentPlayer.name} is bidding...`}
                        </div>
                        {/* Show bidding progress */}
                        <div className="mt-2 text-xs text-gray-400 text-center">
                          {Object.keys(gameState.bids).length}/{gameState.numberOfPlayers} players bid
                        </div>
                      </div>
                    );
                  }
                })()}

                {/* PLAYING: Card selection and game status */}
                {gameState.phase === 'playing' && (() => {
                  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
                  const isHumanTurn = currentPlayer.id === 'human';
                  const humanPlayer = gameState.players.find(p => p.id === 'human');
                  
                  if (isHumanTurn && humanPlayer) {
                    // Human's turn to play a card
                    return (
                      <div className="bg-black/60 backdrop-blur-sm border border-green-600/30 rounded-lg p-3 w-full">
                        <h3 className="text-sm font-serif text-green-300 mb-2 text-center">Your Turn</h3>
                        <div className="text-xs text-gray-300 mb-3 text-center">
                          Click a card on your mantle to play
                        </div>
                        <div className="text-xs text-purple-200 text-center">
                          Trick {(gameState.completedTricks?.length || 0) + 1} of {gameState.round}
                        </div>
                      </div>
                    );
                  } else {
                    // Show playing status
                    return (
                      <div className="bg-black/60 backdrop-blur-sm border border-blue-600/30 rounded-lg p-3 w-full">
                        <h3 className="text-sm font-serif text-blue-300 mb-2 text-center">Playing</h3>
                        <div className="text-xs text-gray-300 text-center mb-2">
                          Round {gameState.round}
                        </div>
                        <div className="text-xs text-blue-200 text-center">
                          {`${currentPlayer.name} is playing...`}
                        </div>
                        <div className="mt-2 text-xs text-gray-400 text-center">
                          Trick {(gameState.completedTricks?.length || 0) + 1} of {gameState.round}
                        </div>
                      </div>
                    );
                  }
                })()}

                {/* TRICK COMPLETE: Show winner and countdown */}
                {gameState.phase === 'trick-complete' && gameState.completedTricks.length > 0 && (() => {
                  const lastTrick = gameState.completedTricks[gameState.completedTricks.length - 1];
                  const winner = gameState.players.find(p => p.id === lastTrick.winner);
                  
                  return (
                    <div className="bg-black/60 backdrop-blur-sm border border-yellow-600/30 rounded-lg p-3 w-full">
                      <h3 className="text-sm font-serif text-yellow-300 mb-2 text-center">Trick Winner!</h3>
                      <div className="text-center mb-2">
                        <div className="text-lg text-yellow-200 font-semibold">
                          {winner?.name || 'Unknown'}
                        </div>
                      </div>
                      <div className="text-xs text-gray-300 text-center">
                        Trick {gameState.completedTricks.length} of {gameState.round}
                      </div>
                      <div className="text-xs text-yellow-200 text-center mt-2">
                        Next trick starting...
                      </div>
                    </div>
                  );
                })()}
              </div>
            </>
          )}
        </GameTable>

        {/* New Game Button - Bottom right with NEW functionality */}
        {gameState && (
          <div className="fixed bottom-8 right-8">
            <button
              onClick={resetToPlayerSelection}
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
