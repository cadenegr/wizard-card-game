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
  
  // MIRROR SYMMETRY - Top and bottom are mirrors of each other
  const getGridArea = () => {
    switch (position) {
      case 1: return '1 / 1 / 2 / 2'; // Top-left seat
      case 2: return '1 / 2 / 2 / 3'; // Top-center seat  
      case 3: return '1 / 3 / 2 / 4'; // Top-right seat
      case 4: return '3 / 1 / 4 / 2'; // Bottom-left seat (MIRROR of seat 1)
      case 5: return '3 / 2 / 4 / 3'; // Bottom-center seat (MIRROR of seat 2) 
      case 6: return '3 / 3 / 4 / 4'; // Bottom-right seat (MIRROR of seat 3)
      default: return '1 / 1 / 2 / 2';
    }
  };

  const cardCount = player.cards.length;
  
  // Determine if this is a bottom seat (needs flipped layout)
  const isBottomSeat = position >= 4;
  
  return (
    <div 
      style={{ 
        gridArea: getGridArea()
      }}
      className="w-full h-full flex items-center justify-center"
    >
      {/* Player mantle - FIXED SIZE regardless of grid area */}
      <div 
        className={`rounded-lg border-2 shadow-lg p-2 flex flex-col gap-1 ${
          isHumanPlayer 
            ? 'bg-gradient-to-br from-green-500/80 to-green-700/80 border-green-400' 
            : 'bg-gradient-to-br from-red-500/80 to-red-700/80 border-red-400'
        } ${isBottomSeat ? 'flex-col-reverse' : 'flex-col'}`}
        style={{
          width: '120px',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        
        {/* Player name with position indicator */}
        <div className="text-xs text-white font-semibold text-center">
          {player.name}
          {isCurrentPlayer && " 🎯"}
        </div>
        
        {/* Player info */}
        <div className="text-xs text-gray-200 text-center">
          Cards: {cardCount}
        </div>

        {/* Cards - POSITIONED FOR MIRROR SYMMETRY */}
        <div className="flex gap-1 justify-center items-center">
          {isHumanPlayer ? (
            // Human: Show actual cards
            player.cards.slice(0, 3).map((card: Card, index: number) => (
              <CardComponent
                key={card.id}
                card={card}
                isRevealed={true}
                className="w-6 h-9"
                onClick={canPlayCards ? () => onCardPlay?.(card.id) : undefined}
              />
            ))
          ) : (
            // Bots: Show card backs
            Array.from({ length: Math.min(cardCount, 2) }, (_, index) => (
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
                className="w-6 h-9"
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}