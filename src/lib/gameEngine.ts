// WIZARD Card Game - Core Game Engine
// This handles all the game logic, state management, and rule enforcement

import { Card, Player, GameState, Trick, GameRound, GameConfig } from './gameTypes';
import { createDeck, shuffleDeck } from './cards';

export class WizardGameEngine {
  private gameState: GameState;
  private config: GameConfig;

  constructor(config: GameConfig) {
    this.config = config;
    this.gameState = this.initializeGame(config);
  }

  // Initialize a new game
  private initializeGame(config: GameConfig): GameState {
    const players: Player[] = [];
    
    // Add human player
    players.push({
      id: 'human',
      name: config.playerName,
      type: 'human',
      cards: [],
      bid: null,
      tricksWon: 0,
      totalScore: 0
    });

    // Add bot players
    for (let i = 0; i < config.numberOfBots; i++) {
      const difficulty = config.botDifficulties[i] || 'medium';
      players.push({
        id: `bot-${i + 1}`,
        name: `Bot ${i + 1}`,
        type: 'bot',
        cards: [],
        bid: null,
        tricksWon: 0,
        totalScore: 0,
        difficulty: difficulty
      });
    }

    return {
      gameId: `game-${Date.now()}`,
      players,
      numberOfPlayers: config.numberOfPlayers,
      round: 1,
      phase: 'setup',
      currentPlayerIndex: 0,
      trumpCard: null,
      trumpSuit: null,
      deck: [],
      bids: {},
      biddingComplete: false,
      currentTrick: null,
      completedTricks: [],
      cardsPlayedThisTrick: 0,
      roundScores: [],
      gameHistory: []
    };
  }

  // Start a new round
  startRound(): GameState {
    const { round } = this.gameState;
    
    // Reset round-specific state
    this.gameState.phase = 'bidding';
    this.gameState.bids = {};
    this.gameState.biddingComplete = false;
    this.gameState.currentTrick = null;
    this.gameState.completedTricks = [];
    this.gameState.cardsPlayedThisTrick = 0;
    this.gameState.trumpCard = null;
    this.gameState.trumpSuit = null;
    
    // Reset player round state
    this.gameState.players.forEach(player => {
      player.cards = [];
      player.bid = null;
      player.tricksWon = 0;
    });

    // Create and shuffle deck
    this.gameState.deck = shuffleDeck(createDeck());

    // Deal cards (round number = cards per player)
    this.dealCards(round);

    // Set trump card (if not all cards dealt)
    if (round < 13) {
      this.setTrumpCard();
    }

    return { ...this.gameState };
  }

  // Deal cards to all players
  private dealCards(cardsPerPlayer: number): void {
    const { players, deck } = this.gameState;
    
    for (let i = 0; i < cardsPerPlayer; i++) {
      for (let j = 0; j < players.length; j++) {
        if (deck.length > 0) {
          const card = deck.pop()!;
          players[j].cards.push(card);
        }
      }
    }
  }

  // Set trump card and trump suit
  private setTrumpCard(): void {
    if (this.gameState.deck.length > 0) {
      const trumpCard = this.gameState.deck.pop()!;
      this.gameState.trumpCard = trumpCard;
      
      // Determine trump suit
      if (trumpCard.type === 'wizard') {
        // Trump suit will be chosen by dealer or first player
        this.gameState.trumpSuit = null;
      } else if (trumpCard.type === 'jester') {
        // No trump this round
        this.gameState.trumpSuit = null;
      } else {
        // Number card - its suit is trump
        this.gameState.trumpSuit = trumpCard.suit;
      }
    }
  }

  // Handle player bid
  makeBid(playerId: string, bid: number): GameState {
    if (this.gameState.phase !== 'bidding') {
      throw new Error('Not in bidding phase');
    }

    const player = this.gameState.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    // Validate bid
    const maxBid = this.gameState.round;
    if (bid < 0 || bid > maxBid) {
      throw new Error(`Bid must be between 0 and ${maxBid}`);
    }

    // Record bid
    this.gameState.bids[playerId] = bid;
    player.bid = bid;

    // Check if all players have bid
    const allBids = Object.keys(this.gameState.bids).length === this.gameState.numberOfPlayers;
    if (allBids) {
      this.gameState.biddingComplete = true;
      this.gameState.phase = 'playing';
      this.startFirstTrick();
    }

    return { ...this.gameState };
  }

  // Start the first trick of the round
  private startFirstTrick(): void {
    this.gameState.currentTrick = {
      id: `trick-${this.gameState.round}-1`,
      leadPlayer: 0, // First player leads first trick
      cardsPlayed: [],
      winner: '',
      trumpSuit: this.gameState.trumpSuit
    };
    this.gameState.currentPlayerIndex = 0;
    this.gameState.cardsPlayedThisTrick = 0;
  }

  // Handle playing a card
  playCard(playerId: string, cardId: string): GameState {
    if (this.gameState.phase !== 'playing') {
      throw new Error('Not in playing phase');
    }

    const player = this.gameState.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    const card = player.cards.find(c => c.id === cardId);
    if (!card) {
      throw new Error('Card not found in player hand');
    }

    // Validate if card can be played (basic rule: must follow suit if possible)
    if (!this.canPlayCard(player, card)) {
      throw new Error('Invalid card play - must follow suit if possible');
    }

    // Remove card from player's hand
    player.cards = player.cards.filter(c => c.id !== cardId);

    // Add card to current trick
    this.gameState.currentTrick!.cardsPlayed.push({
      playerId: playerId,
      card: card,
      order: this.gameState.cardsPlayedThisTrick
    });

    this.gameState.cardsPlayedThisTrick++;

    // Check if trick is complete
    if (this.gameState.cardsPlayedThisTrick === this.gameState.numberOfPlayers) {
      this.completeTrick();
    } else {
      // Move to next player
      this.gameState.currentPlayerIndex = (this.gameState.currentPlayerIndex + 1) % this.gameState.numberOfPlayers;
    }

    return { ...this.gameState };
  }

  // Check if a card can be played (following suit rules)
  private canPlayCard(player: Player, card: Card): boolean {
    const currentTrick = this.gameState.currentTrick;
    if (!currentTrick || currentTrick.cardsPlayed.length === 0) {
      // First card of trick - can play anything
      return true;
    }

    const leadCard = currentTrick.cardsPlayed[0].card;
    
    // Wizards and Jesters can always be played
    if (card.type === 'wizard' || card.type === 'jester') {
      return true;
    }

    // If lead card is wizard or jester, can play anything
    if (leadCard.type === 'wizard' || leadCard.type === 'jester') {
      return true;
    }

    // Must follow suit if possible
    const leadSuit = leadCard.suit;
    const hasLeadSuit = player.cards.some(c => c.suit === leadSuit && c.type === 'number');
    
    if (hasLeadSuit && card.suit !== leadSuit) {
      return false; // Must follow suit
    }

    return true;
  }

  // Complete the current trick and determine winner
  private completeTrick(): void {
    const trick = this.gameState.currentTrick!;
    const winner = this.determineTrickWinner(trick);
    
    trick.winner = winner;
    this.gameState.completedTricks.push(trick);

    // Update tricks won
    const winningPlayer = this.gameState.players.find(p => p.id === winner)!;
    winningPlayer.tricksWon++;

    // Check if round is complete
    if (this.gameState.completedTricks.length === this.gameState.round) {
      this.completeRound();
    } else {
      // Start next trick with winner leading
      const winnerIndex = this.gameState.players.findIndex(p => p.id === winner);
      this.gameState.currentPlayerIndex = winnerIndex;
      this.startNextTrick();
    }
  }

  // Determine winner of a trick based on WIZARD rules
  private determineTrickWinner(trick: Trick): string {
    const { cardsPlayed, trumpSuit } = trick;
    
    // Check for Wizards first (they always win)
    const wizards = cardsPlayed.filter(cp => cp.card.type === 'wizard');
    if (wizards.length > 0) {
      // First wizard played wins
      const firstWizard = wizards.reduce((first, current) => 
        current.order < first.order ? current : first
      );
      return firstWizard.playerId;
    }

    // Filter out Jesters (they never win)
    const validCards = cardsPlayed.filter(cp => cp.card.type !== 'jester');
    
    if (validCards.length === 0) {
      // All jesters - first player wins
      return cardsPlayed[0].playerId;
    }

    const leadCard = cardsPlayed[0].card;
    const leadSuit = leadCard.type === 'jester' ? null : leadCard.suit;

    // Check for trump cards (if trump suit exists and lead wasn't trump)
    if (trumpSuit && leadSuit !== trumpSuit) {
      const trumpCards = validCards.filter(cp => cp.card.suit === trumpSuit);
      if (trumpCards.length > 0) {
        // Highest trump wins
        const winningTrump = trumpCards.reduce((highest, current) => {
          return (current.card.value || 0) > (highest.card.value || 0) ? current : highest;
        });
        return winningTrump.playerId;
      }
    }

    // No trumps played - highest card of lead suit wins
    const followSuitCards = validCards.filter(cp => cp.card.suit === leadSuit);
    if (followSuitCards.length > 0) {
      const winner = followSuitCards.reduce((highest, current) => {
        return (current.card.value || 0) > (highest.card.value || 0) ? current : highest;
      });
      return winner.playerId;
    }

    // Fallback - first valid card wins
    return validCards[0].playerId;
  }

  // Start the next trick
  private startNextTrick(): void {
    const trickNumber = this.gameState.completedTricks.length + 1;
    
    this.gameState.currentTrick = {
      id: `trick-${this.gameState.round}-${trickNumber}`,
      leadPlayer: this.gameState.currentPlayerIndex,
      cardsPlayed: [],
      winner: '',
      trumpSuit: this.gameState.trumpSuit
    };
    
    this.gameState.cardsPlayedThisTrick = 0;
  }

  // Complete the current round and calculate scores
  private completeRound(): void {
    this.gameState.phase = 'scoring';
    
    // Calculate scores for this round
    const roundScores: { [playerId: string]: number } = {};
    
    this.gameState.players.forEach(player => {
      const bid = player.bid || 0;
      const tricks = player.tricksWon;
      
      let score = 0;
      if (bid === tricks) {
        // Made exact bid
        score = 20 + (10 * bid);
      } else {
        // Missed bid - lose 10 points per trick difference
        score = -10 * Math.abs(bid - tricks);
      }
      
      roundScores[player.id] = score;
      player.totalScore += score;
    });

    // Save round to history
    const roundHistory: GameRound = {
      round: this.gameState.round,
      trumpCard: this.gameState.trumpCard,
      trumpSuit: this.gameState.trumpSuit,
      playerBids: { ...this.gameState.bids },
      playerTricks: {},
      playerScores: roundScores,
      tricks: [...this.gameState.completedTricks]
    };

    this.gameState.players.forEach(player => {
      roundHistory.playerTricks[player.id] = player.tricksWon;
    });

    this.gameState.gameHistory.push(roundHistory);
    this.gameState.roundScores.push(roundScores);

    // Check if game is complete
    if (this.gameState.round >= 13) {
      this.gameState.phase = 'finished';
    } else {
      // Prepare for next round
      this.gameState.round++;
      this.gameState.phase = 'setup';
    }
  }

  // Get current game state (readonly)
  getGameState(): Readonly<GameState> {
    return { ...this.gameState };
  }

  // Get valid cards that current player can play
  getValidCards(playerId: string): Card[] {
    const player = this.gameState.players.find(p => p.id === playerId);
    if (!player) return [];

    if (this.gameState.phase !== 'playing') return [];

    return player.cards.filter(card => this.canPlayCard(player, card));
  }

  // Check if it's a player's turn
  isPlayerTurn(playerId: string): boolean {
    const playerIndex = this.gameState.players.findIndex(p => p.id === playerId);
    return playerIndex === this.gameState.currentPlayerIndex;
  }

  // Get game winner(s)
  getWinners(): Player[] {
    if (this.gameState.phase !== 'finished') return [];

    const maxScore = Math.max(...this.gameState.players.map(p => p.totalScore));
    return this.gameState.players.filter(p => p.totalScore === maxScore);
  }
}

// Helper function to create a new game
export function createWizardGame(config: GameConfig): WizardGameEngine {
  return new WizardGameEngine(config);
}