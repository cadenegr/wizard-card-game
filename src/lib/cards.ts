// Import types from gameTypes for consistency
import { Card, Suit } from './gameTypes';

// Create the full deck of 60 cards
export function createDeck(): Card[] {
  const cards: Card[] = [];
  const suits: Suit[] = ['blue', 'red', 'yellow', 'green'];
  
  // Create 52 regular cards (13 per suit)
  suits.forEach(suit => {
    const colors = getSuitColors(suit);
    for (let value = 1; value <= 13; value++) {
      cards.push({
        id: `${suit}-${value}`,
        suit,
        value,
        type: 'number',
        backgroundColor: colors.background,
        textColor: colors.text
      });
    }
  });
  
  // Create 4 Wizards (1 per suit)
  suits.forEach(suit => {
    const colors = getSuitColors(suit);
    cards.push({
      id: `${suit}-wizard`,
      suit: null,  // Wizards have no suit
      value: null,  // Wizards have no numerical value
      type: 'wizard',
      backgroundColor: colors.background,
      textColor: colors.text
    });
  });
  
  // Create 4 Jesters (1 per suit)
  suits.forEach(suit => {
    const colors = getSuitColors(suit);
    cards.push({
      id: `${suit}-jester`,
      suit: null,  // Jesters have no suit  
      value: null,  // Jesters have no numerical value
      type: 'jester',
      backgroundColor: colors.background,
      textColor: colors.text
    });
  });
  
  return cards;
}

// Get CSS colors for each suit
function getSuitColors(suit: Suit): { background: string; text: string } {
  const colorMap = {
    blue: { background: 'bg-blue-800', text: 'text-white' },
    red: { background: 'bg-red-900', text: 'text-white' },
    yellow: { background: 'bg-yellow-600', text: 'text-black' },
    green: { background: 'bg-green-700', text: 'text-white' }
  };
  return colorMap[suit];
}

// Shuffle function
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}