// WIZARD Card Game - Core Game Engine
// This handles all the game logic, state management, and rule enforcement

import { Card, Player, GameState, GameConfig, Trick, GameRound } from './gameTypes';
import { BotAI } from './botAI';
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
    
    if (config.clockwisePlayers) {
      // Use clockwise player order if provided
      let botCounter = 1; // Track bot numbering separately
      
      config.clockwisePlayers.forEach((playerInfo) => {
        if (playerInfo.type === 'human') {
          players.push({
            id: 'human',
            name: playerInfo.name,
            type: 'human',
            cards: [],
            bid: null,
            tricksWon: 0,
            totalScore: 0
          });
        } else {
          players.push({
            id: `bot-${botCounter}`,
            name: playerInfo.name,
            type: 'bot',
            cards: [],
            bid: null,
            tricksWon: 0,
            totalScore: 0,
            difficulty: config.botDifficulties[botCounter - 1] || 'medium'
          });
          botCounter++;
        }
      });
    } else {
      // Fallback to original logic
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

      // Add bot players using configuration-driven names
      const botNames = config.botNames || [];
      for (let i = 0; i < config.numberOfBots; i++) {
        const difficulty = config.botDifficulties[i] || 'medium';
        const botName = botNames[i] || `Bot ${i + 1}`;  // Fallback if no name provided
        players.push({
          id: `bot-${i + 1}`,
          name: botName,
          type: 'bot',
          cards: [],
          bid: null,
          tricksWon: 0,
          totalScore: 0,
          difficulty: difficulty
        });
      }
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
      nextTrick: null,
      completedTricks: [],
      cardsPlayedThisTrick: 0,
      roundScores: [],
      gameHistory: [],
      pregameCards: {},
      turnOrderWinner: null
    };
  }

  // Start a new round
  startRound(): GameState {
    const { round } = this.gameState;
    
    // First round starts with pregame turn order determination
    if (round === 1) {
      this.startPregameTurnOrder();
    } else {
      this.startRegularRound();
    }

    return { ...this.gameState };
  }

  // Start pregame turn order determination
  private startPregameTurnOrder(): void {
    this.gameState.phase = 'pregame';
    this.gameState.pregameCards = {};
    this.gameState.turnOrderWinner = null;
    
    // Create and shuffle deck
    this.gameState.deck = shuffleDeck(createDeck());
    
    // Deal one card to each player for turn order
    this.gameState.players.forEach(player => {
      if (this.gameState.deck.length > 0) {
        const card = this.gameState.deck.pop()!;
        this.gameState.pregameCards[player.id] = [card];
      }
    });
    
    // Determine turn order winner
    this.resolveTurnOrder();
  }

  // Start regular round (after pregame)
  private startRegularRound(): void {
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
    this.setTrumpCard();
  }

  // Resolve turn order by comparing pregame cards
  private resolveTurnOrder(): void {
    const players = this.gameState.players;
    const pregameCards = this.gameState.pregameCards;
    
    // Find highest card value among all players
    let highestPlayers: string[] = [];
    let highestValue = -1;
    
    players.forEach(player => {
      const cards = pregameCards[player.id];
      if (cards && cards.length > 0) {
        const cardValue = this.getCardTurnOrderValue(cards[cards.length - 1]);
        if (cardValue > highestValue) {
          highestValue = cardValue;
          highestPlayers = [player.id];
        } else if (cardValue === highestValue) {
          highestPlayers.push(player.id);
        }
      }
    });
    
    // Check for ties
    if (highestPlayers.length > 1) {
      // Tie! Deal another card to tied players only
      highestPlayers.forEach(playerId => {
        if (this.gameState.deck.length > 0) {
          const card = this.gameState.deck.pop()!;
          pregameCards[playerId].push(card);
        }
      });
      
      // Recursively resolve again
      this.resolveTurnOrder();
    } else {
      // We have a winner!
      this.gameState.turnOrderWinner = highestPlayers[0];
      this.gameState.phase = 'pregame-result';
      
      // Set starting player index
      const winnerIndex = players.findIndex(p => p.id === highestPlayers[0]);
      this.gameState.currentPlayerIndex = winnerIndex;
    }
  }

  // Get card value for turn order comparison (Wizard=15, Number=face value, Jester=0)
  private getCardTurnOrderValue(card: Card): number {
    if (card.type === 'wizard') return 15;
    if (card.type === 'jester') return 0;
    return card.value || 0;
  }

  // Continue to bidding phase after pregame result
  continueToBidding(): GameState {
    this.gameState.phase = 'bidding';
    
    // Clear pregame cards and start regular round
    this.gameState.pregameCards = {};
    this.startRegularRound();

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
      console.log('=== BIDDING COMPLETE DEBUG ===');
      console.log('Last bidder index before playing:', this.gameState.currentPlayerIndex);
      console.log('Last bidder name:', this.gameState.players[this.gameState.currentPlayerIndex]?.name);
      console.log('All bids:', this.gameState.bids);
      
      // CRITICAL FIX: Set first player to play as the pregame winner (first bidder)
      // The current player is the last bidder, but we need to start with the pregame winner
      const firstBidderIndex = this.gameState.players.findIndex(p => p.id === this.gameState.turnOrderWinner);
      if (firstBidderIndex >= 0) {
        this.gameState.currentPlayerIndex = firstBidderIndex;
        console.log('✅ Fixed: First player set to pregame winner at index:', firstBidderIndex);
      } else {
        console.log('❌ Error: Could not find pregame winner, keeping current index');
      }
      
      this.gameState.biddingComplete = true;
      this.gameState.phase = 'playing';
      this.startFirstTrick();
      
      console.log('First player to play index:', this.gameState.currentPlayerIndex);
      console.log('First player to play name:', this.gameState.players[this.gameState.currentPlayerIndex]?.name);
    } else {
      // CRITICAL FIX: Advance to next player for bidding
      this.gameState.currentPlayerIndex = (this.gameState.currentPlayerIndex + 1) % this.gameState.numberOfPlayers;
    }

    return { ...this.gameState };
  }

  // Start the first trick of the round
  private startFirstTrick(): void {
    // CRITICAL: Use the current player index from bidding (which follows pregame winner)
    // Do NOT reset to 0 - preserve turn order from pregame
    const leadPlayerIndex = this.gameState.currentPlayerIndex;
    
    this.gameState.currentTrick = {
      id: `trick-${this.gameState.round}-1`,
      leadPlayer: leadPlayerIndex, // Use actual lead player from turn order
      cardsPlayed: [],
      winner: '',
      trumpSuit: this.gameState.trumpSuit
    };
    // Keep currentPlayerIndex unchanged - it already points to the correct first player
    this.gameState.cardsPlayedThisTrick = 0;
  }

  // Handle playing a card
  playCard(playerId: string, cardId: string): GameState {
    if (this.gameState.phase !== 'playing') {
      throw new Error('Not in playing phase');
    }

    console.log('=== PLAY CARD DEBUG ===');
    console.log('Player attempting to play:', playerId);
    console.log('Current player index:', this.gameState.currentPlayerIndex);
    console.log('Expected current player:', this.gameState.players[this.gameState.currentPlayerIndex]?.id);
    console.log('Players array:', this.gameState.players.map((p, i) => `${i}: ${p.name}(${p.id})`));

    const player = this.gameState.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    const card = player.cards.find(c => c.id === cardId);
    if (!card) {
      throw new Error('Card not found in player hand');
    }

    // Validate turn order - player must be current player
    const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
    if (currentPlayer.id !== playerId) {
      console.log('❌ TURN ORDER VIOLATION:', playerId, 'trying to play but current player is', currentPlayer.id);
      throw new Error(`Not your turn! Current player is ${currentPlayer.name}`);
    }

    // If this is the first card of a new trick, switch from nextTrick to currentTrick
    if (this.gameState.nextTrick && this.gameState.cardsPlayedThisTrick === 0) {
      console.log('First card of new trick - switching to nextTrick for card display');
      this.gameState.currentTrick = this.gameState.nextTrick;
      this.gameState.nextTrick = null;
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

  // Process all pending bot moves in playing phase
  processBotMoves(): GameState {
    if (this.gameState.phase !== 'playing') {
      return { ...this.gameState };
    }

    // Keep playing bot cards until it's human's turn or round is complete
    while (this.gameState.phase === 'playing') {
      const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
      
      if (currentPlayer.type === 'human') {
        // Stop when it's human's turn
        break;
      }

      // Bot's turn - get bot decision
      const botDecision = BotAI.makeDecision(currentPlayer, { ...this.gameState }, 'play_card');
      
      if (botDecision.cardToPlay) {
        this.playCard(currentPlayer.id, botDecision.cardToPlay.id);
      } else {
        // Fallback: play first valid card
        const validCards = this.getValidCards(currentPlayer.id);
        if (validCards.length > 0) {
          this.playCard(currentPlayer.id, validCards[0].id);
        }
      }

      // If round completed, break
      if (this.gameState.phase !== 'playing') {
        break;
      }
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
    
    console.log('=== TRICK COMPLETION DEBUG ===');
    console.log('Cards played in trick:', trick.cardsPlayed.length);
    console.log('Trick winner:', winner);
    console.log('Cards before completion:', trick.cardsPlayed.map(cp => `${cp.card.type}-${cp.card.value} by ${cp.playerId}`));
    
    trick.winner = winner;
    this.gameState.completedTricks.push(trick);

    // Update tricks won
    const winningPlayer = this.gameState.players.find(p => p.id === winner)!;
    winningPlayer.tricksWon++;

    // Set phase to show trick result (UI will handle timer and continuation)
    // IMPORTANT: Keep currentTrick intact so UI can display cards during trick-complete phase
    this.gameState.phase = 'trick-complete';
    
    console.log('Phase set to trick-complete, currentTrick preserved for display');
  }

  // Continue after showing trick result
  continueAfterTrick(): GameState {
    if (this.gameState.phase !== 'trick-complete') {
      throw new Error('Not in trick-complete phase');
    }

    // Check if round is complete
    if (this.gameState.completedTricks.length === this.gameState.round) {
      this.completeRound();
    } else {
      // Start next trick with winner leading
      const lastTrick = this.gameState.completedTricks[this.gameState.completedTricks.length - 1];
      const winner = lastTrick.winner;
      const winnerIndex = this.gameState.players.findIndex(p => p.id === winner);
      this.gameState.currentPlayerIndex = winnerIndex;
      
      // IMPORTANT: Don't clear currentTrick yet - let UI continue showing cards
      // Only clear it when new trick starts and cards are played
      this.startNextTrick();
      this.gameState.phase = 'playing';
    }

    return { ...this.gameState };
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
    
    // IMPORTANT: Don't clear currentTrick immediately - let UI continue showing previous cards
    // Only replace currentTrick when first card of new trick is played
    const newTrick = {
      id: `trick-${this.gameState.round}-${trickNumber}`,
      leadPlayer: this.gameState.currentPlayerIndex,
      cardsPlayed: [],
      winner: '',
      trumpSuit: this.gameState.trumpSuit
    };
    
    // Store new trick data but keep old currentTrick for UI display
    this.gameState.nextTrick = newTrick;
    this.gameState.cardsPlayedThisTrick = 0;
    
    console.log('Next trick prepared, old currentTrick preserved for display');
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
      // Automatically start next round
      this.startRound();
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