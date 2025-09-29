import { Card } from '@/lib/gameTypes';

interface CardProps {
  card: Card;
  isRevealed: boolean;
  className?: string;
  onClick?: () => void;  // For interactive cards
}

export default function CardComponent({ card, isRevealed, className = "", onClick }: CardProps) {
  if (!isRevealed) {
    // Card back design
    return (
      <div 
        className={`w-24 h-36 bg-gradient-to-br from-purple-800 to-purple-900 border-2 border-purple-600 rounded-lg flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform ${className}`}
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

  return (
    <div className={`w-24 h-36 ${card.backgroundColor} border-2 border-gray-300 rounded-lg flex flex-col items-center justify-center shadow-lg ${className}`}>
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