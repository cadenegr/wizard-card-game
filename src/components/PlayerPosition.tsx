import { Card, Player } from '@/lib/gameTypes';
import CardComponent from './Card';

interface PlayerPositionProps {
  player: Player;
  position: 1 | 2 | 3 | 5;
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
  
  // Simple grid area mapping - NO COMPLEX CONFIG
  const getGridArea = () => {
    switch (position) {
      case 1: return 'bot1';
      case 2: return 'bot2';
      case 3: return 'bot3';
      case 5: return 'human';
      default: return 'bot1';
    }
  };

  const cardCount = player.cards.length;
  
  return (
    <div 
      style={{ gridArea: getGridArea() }}
      className="flex flex-col items-center justify-center gap-2"
    >
      {/* Player mantle */}
      <div className={`w-20 h-12 rounded border shadow-md ${
        isHumanPlayer 
          ? 'bg-gradient-to-br from-green-600 to-green-800 border-green-500' 
          : 'bg-gradient-to-br from-red-600 to-red-800 border-red-500'
      }`}></div>
      
      {/* Player info */}
      <div className="text-center">
        <div className="text-xs text-amber-300 font-semibold">
          {player.name}
          {isCurrentPlayer && " 🎯"}
        </div>
        <div className="text-xs text-gray-400">
          Cards: {cardCount}
        </div>
      </div>
      
      {/* Cards - SIMPLE APPROACH */}
      <div className="flex gap-1 justify-center flex-wrap max-w-[200px]">
        {isHumanPlayer ? (
          // Human: Show actual cards
          player.cards.slice(0, 5).map((card: Card, index: number) => (
            <CardComponent
              key={card.id}
              card={card}
              isRevealed={true}
              className="w-12 h-16"
              onClick={canPlayCards ? () => onCardPlay?.(card.id) : undefined}
            />
          ))
        ) : (
          // Bots: Show card backs
          Array.from({ length: Math.min(cardCount, 3) }, (_, index) => (
            <CardComponent
              key={index}
              card={{ 
                id: `back-${index}`, 
                type: 'number', 
                value: 1, 
                suit: 'blue',
                backgroundColor: '#3B82F6',
                textColor: '#FFFFFF'
              }}
              isRevealed={false}
              className="w-12 h-16"
            />
          ))
        )}
      </div>
    </div>
  );
}