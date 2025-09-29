import { Card, Player } from '@/lib/gameTypes';
import CardComponent from './Card';

interface PlayerPositionProps {
  player: Player;
  position: 1 | 2 | 3 | 4 | 5 | 6;
  isCurrentPlayer?: boolean;
  isHumanPlayer?: boolean;
  onCardPlay?: (cardId: string) => void;
  canPlayCards?: boolean;
}

export default function PlayerPosition({ 
  player, 
  position, 
  isCurrentPlayer = false,
  isHumanPlayer = false,
  onCardPlay,
  canPlayCards = false
}: PlayerPositionProps) {
  
  // Define position-specific styling
  const getPositionStyles = () => {
    switch (position) {
      case 1: // Top-left
        return {
          container: "absolute top-2 left-4",
          cards: "flex gap-1",
          name: "absolute -top-6 left-0 text-xs text-amber-300 font-semibold"
        };
      case 2: // Top-center  
        return {
          container: "absolute top-2 left-1/2 transform -translate-x-1/2",
          cards: "flex gap-1",
          name: "absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-amber-300 font-semibold"
        };
      case 3: // Top-right
        return {
          container: "absolute top-2 right-4",
          cards: "flex gap-1",
          name: "absolute -top-6 right-0 text-xs text-amber-300 font-semibold"
        };
      case 4: // Bottom-left
        return {
          container: "absolute bottom-24 left-4",
          cards: "flex gap-1",
          name: "absolute -bottom-6 left-0 text-xs text-amber-300 font-semibold"
        };
      case 5: // Bottom-center (Human player)
        return {
          container: "absolute bottom-2 left-1/2 transform -translate-x-1/2",
          cards: "flex gap-1 justify-center",
          name: "absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-xs text-amber-300 font-semibold"
        };
      case 6: // Bottom-right
        return {
          container: "absolute bottom-24 right-4",
          cards: "flex gap-1",
          name: "absolute -bottom-6 right-0 text-xs text-amber-300 font-semibold"
        };
    }
  };

  const styles = getPositionStyles();
  const cardCount = player.cards.length;
  
  return (
    <div className={styles.container}>
      {/* Player name and info */}
      <div className={styles.name}>
        {player.name}
        {isCurrentPlayer && " 🎯"}
      </div>
      
      {/* Player stats */}
      <div className="absolute -top-4 left-0 text-xs text-gray-400">
        Cards: {cardCount} | Bid: {player.bid ?? 'None'} | Tricks: {player.tricksWon}
      </div>
      
      {/* Cards */}
      <div className={styles.cards}>
        {cardCount > 0 && (
          <>
            {isHumanPlayer ? (
              // Human player - show all cards face up
              player.cards.map((card: Card, index: number) => (
                <div
                  key={card.id}
                  onClick={() => canPlayCards && onCardPlay?.(card.id)}
                  className={`${canPlayCards ? 'cursor-pointer hover:scale-105 hover:-translate-y-2' : ''} transition-all`}
                  style={{ zIndex: index }}
                >
                  <CardComponent
                    card={card}
                    isRevealed={true}
                    className="w-12 h-16" // Smaller cards for table
                  />
                </div>
              ))
            ) : (
              // Bot players - show card backs in fan formation
              Array.from({ length: Math.min(cardCount, 5) }, (_, index) => (
                <div
                  key={index}
                  className="relative"
                  style={{ 
                    zIndex: index,
                    marginLeft: index > 0 ? '-8px' : '0' // Slight overlap for fan effect
                  }}
                >
                  <CardComponent
                    card={{ 
                      id: `back-${index}`, 
                      type: 'number', 
                      value: 1, 
                      suit: 'blue',
                      backgroundColor: '#3B82F6',
                      textColor: '#FFFFFF'
                    }}
                    isRevealed={false} // Show card back
                    className="w-12 h-16" // Smaller cards for table
                  />
                </div>
              ))
            )}
            {/* Show "+X" if player has more than 5 cards */}
            {!isHumanPlayer && cardCount > 5 && (
              <div className="text-xs text-amber-300 self-center ml-1">
                +{cardCount - 5}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}