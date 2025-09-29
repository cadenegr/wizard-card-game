interface GameTableProps {
  children: React.ReactNode;
  className?: string;
}

export default function GameTable({ children, className = "" }: GameTableProps) {
  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* Simple stone table - CSS Grid */}
      <div className="bg-gradient-to-br from-stone-600 via-stone-700 to-stone-800 rounded-3xl p-8 shadow-2xl border-4 border-stone-500 min-h-[600px] relative">
        
        {/* Stone texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-stone-500/20 to-stone-900/40 rounded-3xl"></div>
        
        {/* Table surface with simple grid */}
        <div className="relative w-full h-full bg-gradient-to-br from-stone-500 via-stone-600 to-stone-700 rounded-2xl p-6 shadow-inner min-h-[550px]">
          
          {/* Simple CSS Grid - 3x3 Layout */}
          <div 
            className="w-full h-full grid gap-4 min-h-[500px]"
            style={{
              gridTemplateRows: '100px 1fr 100px',
              gridTemplateColumns: '1fr 2fr 1fr',
              gridTemplateAreas: `
                "bot1   bot2    bot3"
                "left   center  right"  
                "empty  human   empty"
              `
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}