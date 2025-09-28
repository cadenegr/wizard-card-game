interface GameTableProps {
  children: React.ReactNode;
  className?: string;
}

export default function GameTable({ children, className = "" }: GameTableProps) {
  return (
    <div className={`relative ${className}`}>
            {/* Player Labels - Outside the table, positioned to match mantles */}
      {/* Top Row Labels */}
      <div className="absolute -top-6 inset-x-0">
        <div className="absolute left-8 text-xs text-amber-300 font-semibold">Player 1</div>
        <div className="absolute left-1/2 transform -translate-x-1/2 text-xs text-amber-300 font-semibold">Player 2</div>
        <div className="absolute right-8 text-xs text-amber-300 font-semibold">Player 3</div>
      </div>

      {/* Bottom Row Labels */}
      <div className="absolute -bottom-6 inset-x-0">
        <div className="absolute left-8 text-xs text-amber-300 font-semibold">Player 4</div>
        <div className="absolute left-1/2 transform -translate-x-1/2 text-xs text-amber-300 font-semibold">Player 5</div>
        <div className="absolute right-8 text-xs text-amber-300 font-semibold">Player 6</div>
      </div>

      {/* Stone table surface */}
      {/* Stone table surface */}
      <div className="bg-gradient-to-br from-stone-600 via-stone-700 to-stone-800 rounded-3xl p-8 shadow-2xl border-4 border-stone-500">
        {/* Stone texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-stone-500/20 to-stone-900/40 rounded-3xl"></div>
        
        {/* Stone edge highlight */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-stone-400/30 rounded-3xl"></div>
        
        {/* Inner stone surface */}
        <div className="relative bg-gradient-to-br from-stone-500 via-stone-600 to-stone-700 rounded-2xl p-6 shadow-inner">
          {/* Subtle stone pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-stone-400/10 via-transparent to-stone-800/20 rounded-2xl"></div>
          
          {/* Player Mantles ON the table surface */}
          {/* Top Row Mantles - Distributed across table width */}
          <div className="absolute top-4 inset-x-4">
            {/* Left mantle */}
            <div className="absolute left-0 w-20 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded border border-red-500 shadow-md"></div>
            {/* Center mantle */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-20 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded border border-red-500 shadow-md"></div>
            {/* Right mantle */}
            <div className="absolute right-0 w-20 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded border border-red-500 shadow-md"></div>
          </div>
          
          {/* Bottom Row Mantles - Distributed across table width */}
          <div className="absolute bottom-16 inset-x-4">
            {/* Left mantle */}
            <div className="absolute left-0 w-20 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded border border-red-500 shadow-md"></div>
            {/* Center mantle */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-20 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded border border-red-500 shadow-md"></div>
            {/* Right mantle */}
            <div className="absolute right-0 w-20 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded border border-red-500 shadow-md"></div>
          </div>
          
          {/* Game content area */}
          <div className="relative z-10 pt-20 pb-20">
            {children}
          </div>
        </div>
      </div>
      
      {/* Table shadow */}
      <div className="absolute -bottom-4 left-4 right-4 h-8 bg-black/30 blur-lg rounded-full"></div>
    </div>
  );
}