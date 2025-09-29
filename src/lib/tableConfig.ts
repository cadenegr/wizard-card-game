// Table Layout Configuration - NEVER CHANGES
// This is called "Configuration as Code" or "Declarative Architecture"

export interface MantleConfig {
  id: number;
  position: {
    x: string; // CSS positioning (left, right, center)
    y: string; // CSS positioning (top, bottom)
  };
  transform: string; // CSS transform
  color: 'red' | 'green';
  playerType: 'bot' | 'human';
}

export interface TableConfig {
  dimensions: {
    width: string;
    height: string;
    minHeight: string;
  };
  mantles: MantleConfig[];
  cardPositions: {
    [key: number]: {
      container: string;
      alignment: string;
    };
  };
  centerElements: {
    trumpCard: string;
    gameInfo: string;
    deck: string;
  };
}

// IMMUTABLE TABLE CONFIGURATION
// This defines the table ONCE and never changes
export const WIZARD_TABLE_CONFIG: TableConfig = {
  // Table dimensions - FIXED
  dimensions: {
    width: "w-full max-w-4xl",
    height: "min-h-[600px]",
    minHeight: "min-h-[550px]"
  },

  // Mantle positions - FIXED AND SYMMETRIC  
  mantles: [
    {
      id: 1,
      position: { x: "left-8", y: "top-4" },
      transform: "",
      color: 'red',
      playerType: 'bot'
    },
    {
      id: 2, 
      position: { x: "left-1/2", y: "top-4" },
      transform: "transform -translate-x-1/2",
      color: 'red',
      playerType: 'bot'
    },
    {
      id: 3,
      position: { x: "right-8", y: "top-4" },
      transform: "",
      color: 'red', 
      playerType: 'bot'
    },
    {
      id: 5,
      position: { x: "left-1/2", y: "bottom-8" }, // MUST match card position exactly
      transform: "transform -translate-x-1/2",
      color: 'green',
      playerType: 'human'
    }
  ],

  // Card positions - ALIGNED WITH MANTLES
  cardPositions: {
    1: {
      container: "absolute top-4 left-8",
      alignment: "flex gap-0.5 justify-center"
    },
    2: {
      container: "absolute top-4 left-1/2 transform -translate-x-1/2", 
      alignment: "flex gap-0.5 justify-center"
    },
    3: {
      container: "absolute top-4 right-8",
      alignment: "flex gap-0.5 justify-center"  
    },
    5: {
      container: "absolute bottom-8 left-1/2 transform -translate-x-1/2", // Further from center to avoid overlap
      alignment: "flex gap-0.5 justify-center"
    }
  },

  // Center elements - PROPERLY ZONED TO AVOID CONFLICTS
  centerElements: {
    trumpCard: "absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2", // Higher in center zone
    gameInfo: "absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2",  // Even higher
    deck: "absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2"       // Same level as trump, different X
  }
};

// UTILITY FUNCTIONS - "Pure Functions" (no side effects)
export const getMantleConfig = (playerId: number): MantleConfig | undefined => {
  return WIZARD_TABLE_CONFIG.mantles.find(m => m.id === playerId);
};

export const getCardPosition = (playerId: number) => {
  return WIZARD_TABLE_CONFIG.cardPositions[playerId];
};

export const getMantleStyles = (mantle: MantleConfig): string => {
  const colorClasses = mantle.color === 'green' 
    ? 'bg-gradient-to-br from-green-600 to-green-800 border-green-500'
    : 'bg-gradient-to-br from-red-600 to-red-800 border-red-500';
    
  return `absolute ${mantle.position.y} ${mantle.position.x} ${mantle.transform} w-24 h-16 ${colorClasses} rounded border shadow-md`;
};