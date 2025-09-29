// WIZARD Card Game - Bot AI System
// Handles decision making for computer players

import { Player, Card, GameState, BotDecision, Suit } from './gameTypes';

export class BotAI {
  // Main decision maker for bot players
  static makeDecision(
    bot: Player,
    gameState: GameState,
    decisionType: 'bid' | 'play_card'
  ): BotDecision {
    
    if (decisionType === 'bid') {
      return this.makeBid(bot, gameState);
    } else {
      return this.playCard(bot, gameState);
    }
  }

  // Bot bidding strategy
  private static makeBid(bot: Player, gameState: GameState): BotDecision {
    const difficulty = bot.difficulty || 'medium';
    const hand = bot.cards;
    const trumpSuit = gameState.trumpSuit;
    
    let bid = 0;
    let reasoning = '';

    switch (difficulty) {
      case 'easy':
        // Random bidding between 0 and hand size
        bid = Math.floor(Math.random() * (hand.length + 1));
        reasoning = 'Random bid';
        break;

      case 'medium':
        bid = this.calculateMediumBid(hand, trumpSuit);
        reasoning = 'Basic strategy bid';
        break;

      case 'hard':
        bid = this.calculateHardBid(hand, trumpSuit, gameState);
        reasoning = 'Advanced strategy bid';
        break;
    }

    return {
      type: 'bid',
      bid,
      reasoning
    };
  }

  // Bot card playing strategy
  private static playCard(bot: Player, gameState: GameState): BotDecision {
    const difficulty = bot.difficulty || 'medium';
    const validCards = this.getValidCards(bot, gameState);
    
    if (validCards.length === 0) {
      throw new Error('No valid cards to play');
    }

    let cardToPlay: Card;
    let reasoning = '';

    switch (difficulty) {
      case 'easy':
        cardToPlay = validCards[Math.floor(Math.random() * validCards.length)];
        reasoning = 'Random card play';
        break;

      case 'medium':
        cardToPlay = this.chooseMediumCard(validCards, gameState);
        reasoning = 'Basic strategy card play';
        break;

      case 'hard':
        cardToPlay = this.chooseHardCard(validCards, gameState, bot);
        reasoning = 'Advanced strategy card play';
        break;

      default:
        cardToPlay = validCards[0];
        reasoning = 'Default card play';
    }

    return {
      type: 'play_card',
      cardToPlay,
      reasoning
    };
  }

  // Medium difficulty bidding (count likely winners)
  private static calculateMediumBid(hand: Card[], trumpSuit: Suit | null): number {
    let expectedTricks = 0;

    // Count Wizards (guaranteed winners)
    const wizards = hand.filter(card => card.type === 'wizard').length;
    expectedTricks += wizards;

    // Count high trump cards
    if (trumpSuit) {
      const trumpCards = hand.filter(
        card => card.suit === trumpSuit && card.type === 'number'
      );
      const highTrumps = trumpCards.filter(card => (card.value || 0) >= 10);
      expectedTricks += highTrumps.length * 0.8; // 80% chance each
    }

    // Count very high non-trump cards
    const nonTrumpHighs = hand.filter(
      card => card.type === 'number' && 
      card.suit !== trumpSuit && 
      (card.value || 0) >= 12
    );
    expectedTricks += nonTrumpHighs.length * 0.4; // 40% chance each

    // Round to nearest integer, minimum 0
    return Math.max(0, Math.round(expectedTricks));
  }

  // Hard difficulty bidding (advanced hand evaluation)
  private static calculateHardBid(
    hand: Card[],
    trumpSuit: Suit | null,
    gameState: GameState
  ): number {
    let expectedTricks = 0;
    const playerCount = gameState.numberOfPlayers;

    // Wizards are guaranteed winners
    const wizards = hand.filter(card => card.type === 'wizard').length;
    expectedTricks += wizards;

    // Analyze trump cards with position awareness
    if (trumpSuit) {
      const trumpCards = hand.filter(
        card => card.suit === trumpSuit && card.type === 'number'
      ).sort((a, b) => (b.value || 0) - (a.value || 0));

      // High trumps are very likely to win
      trumpCards.forEach(card => {
        const value = card.value || 0;
        if (value >= 11) expectedTricks += 0.9;
        else if (value >= 8) expectedTricks += 0.7;
        else if (value >= 5) expectedTricks += 0.4;
        else expectedTricks += 0.2;
      });
    }

    // Analyze non-trump suits
    const suits: Suit[] = ['blue', 'red', 'yellow', 'green'];
    suits.forEach(suit => {
      if (suit === trumpSuit) return;

      const suitCards = hand.filter(
        card => card.suit === suit && card.type === 'number'
      ).sort((a, b) => (b.value || 0) - (a.value || 0));

      if (suitCards.length > 0) {
        const highestValue = suitCards[0].value || 0;
        // Adjust probability based on number of players and card value
        if (highestValue === 13) expectedTricks += 0.7 / playerCount * 3;
        else if (highestValue >= 11) expectedTricks += 0.5 / playerCount * 3;
        else if (highestValue >= 9) expectedTricks += 0.3 / playerCount * 3;
      }
    });

    // Conservative adjustment - don't overbid
    expectedTricks *= 0.9;

    return Math.max(0, Math.round(expectedTricks));
  }

  // Medium difficulty card play
  private static chooseMediumCard(validCards: Card[], gameState: GameState): Card {
    const currentTrick = gameState.currentTrick;
    
    if (!currentTrick || currentTrick.cardsPlayed.length === 0) {
      // Leading - play a medium card
      const numberCards = validCards.filter(card => card.type === 'number');
      if (numberCards.length > 0) {
        // Sort by value and pick middle card
        numberCards.sort((a, b) => (a.value || 0) - (b.value || 0));
        const middleIndex = Math.floor(numberCards.length / 2);
        return numberCards[middleIndex];
      }
      return validCards[0];
    }

    // Following - try to win if possible, otherwise play low
    const trumpSuit = gameState.trumpSuit;
    
    // Try to play a winning card
    const winningCards = validCards.filter(card => 
      this.canWinTrick(card, currentTrick, trumpSuit)
    );

    if (winningCards.length > 0) {
      // Play lowest winning card
      winningCards.sort((a, b) => {
        if (a.type === 'wizard') return -1;
        if (b.type === 'wizard') return 1;
        return (a.value || 0) - (b.value || 0);
      });
      return winningCards[0];
    }

    // Can't win - play lowest card
    const numberCards = validCards.filter(card => card.type === 'number');
    if (numberCards.length > 0) {
      numberCards.sort((a, b) => (a.value || 0) - (b.value || 0));
      return numberCards[0];
    }

    return validCards[0];
  }

  // Hard difficulty card play (advanced strategy)
  private static chooseHardCard(
    validCards: Card[], 
    gameState: GameState, 
    bot: Player
  ): Card {
    const currentTrick = gameState.currentTrick;
    const bid = bot.bid || 0;
    const tricksWon = bot.tricksWon;
    const tricksNeeded = bid - tricksWon;
    const tricksRemaining = gameState.round - gameState.completedTricks.length;
    
    // Strategic decision based on bid status
    const needToWin = tricksNeeded > 0;
    const mustNotWin = tricksNeeded <= 0 && tricksRemaining <= Math.abs(tricksNeeded);

    if (!currentTrick || currentTrick.cardsPlayed.length === 0) {
      // Leading the trick
      if (needToWin && tricksNeeded === 1) {
        // Need exactly one more trick - play highest card
        return this.getHighestCard(validCards);
      } else if (mustNotWin) {
        // Don't want to win - play lowest card
        return this.getLowestCard(validCards);
      } else {
        // Play medium card
        return this.chooseMediumCard(validCards, gameState);
      }
    }

    // Following in trick
    const canWin = validCards.some(card => 
      this.canWinTrick(card, currentTrick, gameState.trumpSuit)
    );

    if (needToWin && canWin) {
      // Try to win with lowest possible winning card
      const winningCards = validCards.filter(card =>
        this.canWinTrick(card, currentTrick, gameState.trumpSuit)
      );
      return this.getLowestCard(winningCards);
    } else if (mustNotWin) {
      // Avoid winning at all costs
      const nonWinningCards = validCards.filter(card =>
        !this.canWinTrick(card, currentTrick, gameState.trumpSuit)
      );
      if (nonWinningCards.length > 0) {
        return this.getHighestCard(nonWinningCards); // High but not winning
      }
    }

    // Default to medium strategy
    return this.chooseMediumCard(validCards, gameState);
  }

  // Helper: Check if a card can win the current trick
  private static canWinTrick(
    card: Card, 
    trick: { cardsPlayed: { playerId: string; card: Card; order: number }[] }, 
    trumpSuit: Suit | null
  ): boolean {
    if (card.type === 'wizard') return true;
    if (card.type === 'jester') return false;

    const currentWinner = this.getCurrentTrickWinner(trick, trumpSuit);
    if (!currentWinner) return true; // First card always "wins" so far

    if (currentWinner.type === 'wizard') return false;
    if (currentWinner.type === 'jester' && card.type === 'number') return true;

    // Both number cards - compare values and suits
    const currentWinnerIsTrump = currentWinner.suit === trumpSuit;
    const cardIsTrump = card.suit === trumpSuit;

    if (cardIsTrump && !currentWinnerIsTrump) return true;
    if (!cardIsTrump && currentWinnerIsTrump) return false;
    if (card.suit === currentWinner.suit) {
      return (card.value || 0) > (currentWinner.value || 0);
    }

    return false;
  }

  // Helper: Get current trick winner
  private static getCurrentTrickWinner(
    trick: { cardsPlayed: { playerId: string; card: Card; order: number }[] }, 
    trumpSuit: Suit | null
  ): Card | null {
    if (!trick.cardsPlayed.length) return null;

    // Simple winner determination (could be more sophisticated)
    let winner = trick.cardsPlayed[0].card;
    
    for (let i = 1; i < trick.cardsPlayed.length; i++) {
      const card = trick.cardsPlayed[i].card;
      if (this.cardBeats(card, winner, trumpSuit)) {
        winner = card;
      }
    }

    return winner;
  }

  // Helper: Check if card1 beats card2
  private static cardBeats(card1: Card, card2: Card, trumpSuit: Suit | null): boolean {
    if (card1.type === 'wizard') return card2.type !== 'wizard';
    if (card2.type === 'wizard') return false;
    if (card1.type === 'jester') return false;
    if (card2.type === 'jester') return true;

    // Both number cards
    const card1IsTrump = card1.suit === trumpSuit;
    const card2IsTrump = card2.suit === trumpSuit;

    if (card1IsTrump && !card2IsTrump) return true;
    if (!card1IsTrump && card2IsTrump) return false;
    if (card1.suit === card2.suit) {
      return (card1.value || 0) > (card2.value || 0);
    }

    return false; // Different suits, neither trump
  }

  // Helper: Get highest value card
  private static getHighestCard(cards: Card[]): Card {
    return cards.reduce((highest, current) => {
      if (current.type === 'wizard') return current;
      if (highest.type === 'wizard') return highest;
      if (current.type === 'jester') return highest;
      if (highest.type === 'jester') return current;
      return (current.value || 0) > (highest.value || 0) ? current : highest;
    });
  }

  // Helper: Get lowest value card  
  private static getLowestCard(cards: Card[]): Card {
    return cards.reduce((lowest, current) => {
      if (current.type === 'jester') return current;
      if (lowest.type === 'jester') return lowest;
      if (current.type === 'wizard') return lowest;
      if (lowest.type === 'wizard') return current;
      return (current.value || 0) < (lowest.value || 0) ? current : lowest;
    });
  }

  // Helper: Get valid cards for a player (mirrors game engine logic)
  private static getValidCards(bot: Player, gameState: GameState): Card[] {
    const currentTrick = gameState.currentTrick;
    if (!currentTrick || currentTrick.cardsPlayed.length === 0) {
      // First card of trick - can play anything
      return bot.cards;
    }

    const leadCard = currentTrick.cardsPlayed[0].card;
    
    // Wizards and Jesters can always be played
    const wizardsAndJesters = bot.cards.filter(
      card => card.type === 'wizard' || card.type === 'jester'
    );

    // If lead card is wizard or jester, can play anything
    if (leadCard.type === 'wizard' || leadCard.type === 'jester') {
      return bot.cards;
    }

    // Must follow suit if possible
    const leadSuit = leadCard.suit;
    const followSuitCards = bot.cards.filter(
      card => card.suit === leadSuit && card.type === 'number'
    );
    
    if (followSuitCards.length > 0) {
      return [...followSuitCards, ...wizardsAndJesters];
    }

    // Can't follow suit - can play anything
    return bot.cards;
  }
}