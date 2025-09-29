interface GameTableProps {
  children: React.ReactNode;
  className?: string;
}

export default function GameTable({ children, className = "" }: GameTableProps) {
  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* Stone table wrapper */}
      <div 
        className="bg-gradient-to-br from-stone-600 via-stone-700 to-stone-800 rounded-3xl shadow-2xl border-4 border-stone-500 relative"
        style={{ 
          height: '500px',
          width: '700px',
          margin: '0 auto'
        }}
      >
        
        {/* Stone texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-stone-500/20 to-stone-900/40 rounded-3xl"></div>
        
        {/* GameTable - PERFECTLY CENTERED */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
        >
          <div 
            className="relative"
            style={{
              width: '600px',
              height: '400px', 
              display: 'grid',
              gridTemplateRows: '80px 1fr 80px', 
              gridTemplateColumns: '1fr 2fr 1fr',
              gap: '8px',
              padding: '16px',
              background: 'linear-gradient(135deg, #78716c 0%, #57534e 50%, #44403c 100%)',
              borderRadius: '1rem'
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}