import { Card } from '@/lib/gameTypes';

interface CardProps {
  card: Card;
  isRevealed: boolean;
  className?: string;
  onClick?: () => void;  // For interactive cards
  overlapping?: boolean; // New prop for overlapping display
}

export default function CardComponent({ card, isRevealed, className = "", onClick, overlapping = false }: CardProps) {
  if (!isRevealed) {
    // Card back design
    return (
      <div 
        className={`w-16 h-22 bg-gradient-to-br from-purple-800 to-purple-900 border-2 border-purple-600 rounded-lg flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform ${className}`}
        onClick={onClick}
      >
        <div className="text-purple-300 text-xs text-center">
          <div className="mb-1">✨</div>
          <div className="text-[8px]">WIZARD</div>
          <div className="mt-1">✨</div>
        </div>
      </div>
    );
  }

  // Card front design
  const getSymbol = () => {
    if (card.type === 'wizard') return '🧙‍♂️';
    if (card.type === 'jester') return '🃏';
    return card.value?.toString() || '?';
  };

  const getDisplayValue = () => {
    if (card.type === 'wizard') return 'W';
    if (card.type === 'jester') return 'J';
    return card.value?.toString() || '?';
  };

  if (overlapping) {
    // Overlapping card design - number in upper-right corner
    return (
      <div 
        className={`relative ${card.backgroundColor} border-2 border-gray-300 rounded-lg shadow-lg ${className} ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
        onClick={onClick}
      >
        {/* Upper-right corner value */}
        <div className={`absolute top-1 right-1 text-xs font-bold ${card.textColor} bg-white bg-opacity-80 rounded px-1`}>
          {getDisplayValue()}
        </div>
        
        {/* Card suit/type indicator in center */}
        <div className="w-full h-full flex items-center justify-center">
          <div className={`text-xs ${card.textColor} font-semibold text-center`}>
            {card.type === 'wizard' ? '🧙‍♂️' :
             card.type === 'jester' ? '🃏' :
             card.suit?.charAt(0).toUpperCase() || 'C'}
          </div>
        </div>
      </div>
    );
  }

  // Regular card design (center number)
  return (
    <div 
      className={`w-16 h-22 ${card.backgroundColor} border-2 border-gray-300 rounded-lg flex flex-col items-center justify-center shadow-lg ${className} ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
      onClick={onClick}
    >
      {/* Card value/symbol */}
      <div className={`text-2xl font-bold ${card.textColor} mb-1`}>
        {getSymbol()}
      </div>
      
      {/* Card type indicator */}
      <div className={`text-xs ${card.textColor} font-semibold`}>
        {card.type === 'wizard' ? 'WIZARD' :
         card.type === 'jester' ? 'JESTER' :
         card.suit?.toUpperCase() || 'CARD'}
      </div>
    </div>
  );
}