import { Card, Player } from '@/lib/gameTypes';
import CardComponent from './Card';

interface PlayerPositionProps {
  player: Player;
  position: 1 | 2 | 3 | 4 | 5 | 6;
  isCurrentPlayer?: boolean;
  isHumanPlayer?: boolean;
  onCardPlay?: (cardId: string) => void;
  canPlayCards?: boolean;
  pregameCard?: Card; // Card for pregame turn order determination
  gamePhase?: string; // Current game phase
  playerBid?: number | null; // Player's current bid (if any)
  isHumanTurn?: boolean; // Is it currently the human's turn?
}

export default function PlayerPosition({ 
  player, 
  position, 
  isCurrentPlayer = false,
  isHumanPlayer = false,
  onCardPlay,
  canPlayCards = false,
  pregameCard,
  gamePhase,
  playerBid,
  isHumanTurn = false
}: PlayerPositionProps) {
  
  // CLOCKWISE SEATING - True clockwise order: 1→2→3→4→5→6→1
  const getGridArea = () => {
    switch (position) {
      case 1: return '1 / 1 / 2 / 2'; // Top-left seat
      case 2: return '1 / 2 / 2 / 3'; // Top-center seat  
      case 3: return '1 / 3 / 2 / 4'; // Top-right seat
      case 4: return '3 / 3 / 4 / 4'; // Bottom-right seat (clockwise from 3)
      case 5: return '3 / 2 / 4 / 3'; // Bottom-center seat (clockwise from 4) 
      case 6: return '3 / 1 / 4 / 2'; // Bottom-left seat (clockwise from 5)
      default: return '1 / 1 / 2 / 2';
    }
  };

  const cardCount = player.cards.length;
  
  // Determine if this is a bottom seat (needs flipped layout for mirror effect)
  const isBottomSeat = position >= 4; // Seats 4, 5, 6 are bottom row
  
  return (
    <div 
      style={{ 
        gridArea: getGridArea()
      }}
      className="w-full h-full flex items-center justify-center relative"
    >
      {/* OUTER RIM: Name and Cards info - positioned AWAY from table center */}
      <div 
        className={`absolute flex flex-col items-center gap-1 z-10 ${
          isBottomSeat ? 'flex-col-reverse' : 'flex-col'
        }`}
        style={{
          [isBottomSeat ? 'bottom' : 'top']: '-56px',  // Move AWAY from center
          left: '50%',
          transform: 'translateX(-50%)',
          width: '120px'
        }}
      >
        {/* Player name with position indicator */}
        <div className="text-xs text-white font-semibold text-center">
          {player.name}
          {isCurrentPlayer && " 🎯"}
        </div>
        
        {/* Player info - Dynamic based on game phase */}
        <div className="text-xs text-gray-200 text-center">
          {(gamePhase === 'bidding' || gamePhase === 'playing') ? (
            playerBid !== undefined && playerBid !== null ? (
              <span className="text-yellow-300 font-semibold">Trick: {playerBid}</span>
            ) : (
              <span className="text-gray-400">Bidding...</span>
            )
          ) : (
            `Cards: ${cardCount}`
          )}
        </div>
      </div>

      {/* INNER SURFACE: Player mantle - contains only cards */}
      <div 
        className={`rounded-lg border-2 shadow-lg p-2 flex items-center justify-center ${
          isHumanPlayer 
            ? `bg-gradient-to-br from-green-500/80 to-green-700/80 ${
                isHumanTurn && gamePhase === 'playing' 
                  ? 'border-yellow-400 border-4 shadow-yellow-400/50' 
                  : 'border-green-400'
              }` 
            : 'bg-gradient-to-br from-red-500/80 to-red-700/80 border-red-400'
        }`}
        style={{
          width: '120px',
          height: '70px'
        }}
      >

        {/* Cards - POSITIONED FOR MIRROR SYMMETRY */}
        <div className="flex gap-1 justify-center items-center relative">
          {pregameCard ? (
            // PREGAME: Show the single turn order card
            <CardComponent
              key={pregameCard.id}
              card={pregameCard}
              isRevealed={true}
              className="w-8 h-12"
            />
          ) : isHumanPlayer ? (
            // REGULAR GAME: Human shows actual cards with overlapping if multiple
            cardCount <= 3 ? (
              // Few cards: show normally with enhanced click feedback
              player.cards.slice(0, 3).map((card: Card) => (
                <CardComponent
                  key={card.id}
                  card={card}
                  isRevealed={true}
                  className={`w-6 h-9 ${
                    isHumanTurn && gamePhase === 'playing' 
                      ? 'cursor-pointer border-2 border-yellow-300 hover:border-yellow-200 hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-yellow-300/50' 
                      : ''
                  }`}
                  onClick={isHumanTurn && gamePhase === 'playing' ? () => onCardPlay?.(card.id) : undefined}
                />
              ))
            ) : (
              // Many cards: show with overlapping
              <div className="relative flex justify-center" style={{ width: '80px', height: '36px' }}>
                {player.cards.slice(0, Math.min(cardCount, 5)).map((card: Card, index) => (
                  <div
                    key={card.id}
                    className="absolute"
                    style={{ 
                      left: `${index * 12}px`,
                      zIndex: index + 1
                    }}
                  >
                    <CardComponent
                      card={card}
                      isRevealed={true}
                      className={`w-5 h-8 ${
                        isHumanTurn && gamePhase === 'playing' 
                          ? 'cursor-pointer border-2 border-yellow-300 hover:border-yellow-200 hover:scale-110 transition-all duration-200' 
                          : ''
                      }`}
                      overlapping={true}
                      onClick={isHumanTurn && gamePhase === 'playing' ? () => onCardPlay?.(card.id) : undefined}
                    />
                  </div>
                ))}
                {cardCount > 5 && (
                  <div className="absolute right-0 top-0 bg-gray-800 text-white text-xs rounded px-1 z-20">
                    +{cardCount - 5}
                  </div>
                )}
              </div>
            )
          ) : (
            // REGULAR GAME: Bots show card backs with overlapping if multiple
            cardCount <= 2 ? (
              // Few cards: show normally
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
            ) : (
              // Many cards: show with overlapping
              <div className="relative flex justify-center" style={{ width: '60px', height: '36px' }}>
                {Array.from({ length: Math.min(cardCount, 4) }, (_, index) => (
                  <div
                    key={index}
                    className="absolute"
                    style={{ 
                      left: `${index * 10}px`,
                      zIndex: index + 1
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
                      isRevealed={false}
                      className="w-5 h-8"
                    />
                  </div>
                ))}
                {cardCount > 4 && (
                  <div className="absolute right-0 top-0 bg-gray-800 text-white text-xs rounded px-1 z-20">
                    +{cardCount - 4}
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}