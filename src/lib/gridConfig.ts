// Professional Grid-Based Layout Configuration
// This eliminates ALL positioning conflicts using CSS Grid

export interface GridZoneConfig {
  area: string;           // CSS Grid area name
  justifyContent?: string; // Flexbox alignment
  alignItems?: string;    // Flexbox alignment
  padding?: string;       // Safe spacing
}

export interface ProfessionalTableConfig {
  // CSS Grid Template - Defines table structure
  gridTemplate: {
    rows: string;     // "1fr 2fr 1fr" = top, center, bottom
    columns: string;  // "1fr 2fr 1fr" = left, center, right
    areas: string;    // Named grid areas
  };
  
  // Grid Zones - No more absolute positioning!
  zones: {
    [key: string]: GridZoneConfig;
  };
  
  // Card specifications
  cardSizes: {
    normal: string;
    small: string;
  };
}

// PROFESSIONAL GRID LAYOUT - Enterprise Standard
export const PROFESSIONAL_TABLE_CONFIG: ProfessionalTableConfig = {
  // Define 3x3 Grid System
  gridTemplate: {
    rows: "80px 1fr 80px",  // Fixed heights for player zones, flexible center
    columns: "1fr 2fr 1fr", // Left, center (2x width), right
    areas: `
      "bot1    gameinfo   bot3"
      "deck    center     empty"  
      "empty   human      empty"
    `
  },

  // Grid Zones - Professional Layout Management
  zones: {
    // Bot Player Zones
    bot1: {
      area: "bot1",
      justifyContent: "center",
      alignItems: "flex-end",
      padding: "8px"
    },
    bot2: {
      area: "gameinfo", // Bot 2 shares space with game info
      justifyContent: "center", 
      alignItems: "flex-start",
      padding: "8px"
    },
    bot3: {
      area: "bot3",
      justifyContent: "center",
      alignItems: "flex-end", 
      padding: "8px"
    },

    // Center Elements
    trumpCard: {
      area: "center",
      justifyContent: "center",
      alignItems: "center"
    },
    deck: {
      area: "deck",
      justifyContent: "center", 
      alignItems: "center"
    },
    gameInfo: {
      area: "gameinfo",
      justifyContent: "center",
      alignItems: "center"
    },

    // Human Player Zone
    human: {
      area: "human",
      justifyContent: "center",
      alignItems: "flex-start",
      padding: "8px"
    }
  },

  // Consistent Card Sizes
  cardSizes: {
    normal: "w-16 h-22",
    small: "w-12 h-16"
  }
};

// Utility Functions
export const getGridZone = (zoneName: string): GridZoneConfig | undefined => {
  return PROFESSIONAL_TABLE_CONFIG.zones[zoneName];
};

export const generateGridStyles = (): string => {
  const config = PROFESSIONAL_TABLE_CONFIG.gridTemplate;
  return `
    display: grid;
    grid-template-rows: ${config.rows};
    grid-template-columns: ${config.columns};
    grid-template-areas: ${config.areas};
    gap: 16px;
    height: 600px;
    width: 100%;
  `;
};