// WIZARD Card Game - Core Game Engine Types
// This file defines all the data structures for the complete game

export type Suit = 'blue' | 'red' | 'yellow' | 'green';
export type CardType = 'number' | 'wizard' | 'jester';

export interface Card {
  id: string;
  suit: Suit | null;  // null for wizards and jesters
  value: number | null;  // 1-13 for number cards, null for wizards/jesters
  type: CardType;
  backgroundColor: string;
  textColor: string;
  isVisible?: boolean;
}

// Player can be human or bot
export interface Player {
  id: string;
  name: string;
  type: 'human' | 'bot';
  cards: Card[];
  bid: number | null;
  tricksWon: number;
  totalScore: number;
  difficulty?: 'easy' | 'medium' | 'hard';  // for bots only
}

// Individual trick (one round of card playing)
export interface Trick {
  id: string;
  leadPlayer: number;  // index of player who leads
  cardsPlayed: {
    playerId: string;
    card: Card;
    order: number;
  }[];
  winner: string;  // player id who won the trick
  trumpSuit: Suit | null;
}

// Game phases
export type GamePhase = 'setup' | 'pregame' | 'pregame-result' | 'bidding' | 'playing' | 'trick-ready-to-complete' | 'trick-complete' | 'scoring' | 'finished';

// Main game state
export interface GameState {
  // Game setup
  gameId: string;
  players: Player[];
  numberOfPlayers: number;  // 3-6 players
  
  // Current game progress
  round: number;  // 1-13 (round 1 = 1 card each, round 13 = 13 cards each)
  phase: GamePhase;
  currentPlayerIndex: number;
  
  // Round-specific state
  trumpCard: Card | null;  // the card that determines trump suit
  trumpSuit: Suit | null;  // can be overridden by wizard
  deck: Card[];
  
  // Bidding phase
  bids: { [playerId: string]: number };
  biddingComplete: boolean;
  
  // Playing phase
  currentTrick: Trick | null;
  completedTricks: Trick[];
  cardsPlayedThisTrick: number;
  
  // Pregame turn order determination
  pregameCards: { [playerId: string]: Card[] };  // cards dealt for turn order
  turnOrderWinner: string | null;  // player who won turn order
  
  // Scoring
  roundScores: { [playerId: string]: number }[];  // score for each round
  gameHistory: GameRound[];  // complete history
}

// Complete round information for history
export interface GameRound {
  round: number;
  trumpCard: Card | null;
  trumpSuit: Suit | null;
  playerBids: { [playerId: string]: number };
  playerTricks: { [playerId: string]: number };
  playerScores: { [playerId: string]: number };
  tricks: Trick[];
}

// Bot decision making
export interface BotDecision {
  type: 'bid' | 'play_card';
  bid?: number;
  cardToPlay?: Card;
  reasoning?: string;  // for debugging bot logic
}

// Game configuration
export interface GameConfig {
  numberOfPlayers: number;
  numberOfBots: number;
  botDifficulties: ('easy' | 'medium' | 'hard')[];
  playerName: string;
  maxRounds?: number;  // default 13, can be customized
  seatConfiguration?: number[];  // which seats to fill
  botNames?: string[];  // names for bots
  clockwisePlayers?: { name: string; type: 'human' | 'bot' }[];  // players in clockwise order
}