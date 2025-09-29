// ENTERPRISE GRID LAYOUT FRAMEWORK
// Zero hardcoded positioning - Pure CSS Grid + Flexbox
// Used by companies like Netflix, Spotify, Airbnb

export interface CleanLayoutConfig {
  // CSS Grid Areas - Semantic layout zones
  gridAreas: {
    template: string;
    zones: {
      [key: string]: {
        justifyContent: string;
        alignItems: string;
        flexDirection: string;
        gap: string;
        padding?: string;
      };
    };
  };
  
  // Component spacing - No hardcoded values
  spacing: {
    small: string;
    medium: string; 
    large: string;
  };
  
  // Card specifications
  cards: {
    size: string;
    spacing: string;
  };
  
  // Colors - Centralized color system
  colors: {
    mantles: {
      bot: string;
      human: string;
    };
    backgrounds: {
      stone: string;
      info: string;
    };
  };
}

// CLEAN ARCHITECTURE - No absolute positioning anywhere!
export const CLEAN_LAYOUT_CONFIG: CleanLayoutConfig = {
  gridAreas: {
    // 3x4 Grid with semantic zones for 4 players
    template: `
      "bot1     bot2      bot3"
      "deck     center    info"  
      "empty    human     empty"
    `,
    zones: {
      // Bot zones - Use flexbox for internal layout
      bot1: {
        justifyContent: "center",
        alignItems: "flex-end", 
        flexDirection: "column",
        gap: "0.5rem",
        padding: "1rem"
      },
      bot2: {
        justifyContent: "center",
        alignItems: "flex-end",
        flexDirection: "column", 
        gap: "0.5rem",
        padding: "1rem"
      },
      bot3: {
        justifyContent: "center",
        alignItems: "flex-end",
        flexDirection: "column", 
        gap: "0.5rem",
        padding: "1rem"
      },
      
      // Center zones
      info: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "1rem"
      },
      center: {
        justifyContent: "center",
        alignItems: "center", 
        flexDirection: "row",
        gap: "2rem"
      },
      deck: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "0.5rem"
      },
      
      // Human zone
      human: {
        justifyContent: "center",
        alignItems: "flex-start",
        flexDirection: "column",
        gap: "0.5rem",
        padding: "1rem"
      }
    }
  },
  
  spacing: {
    small: "0.5rem",   // 8px
    medium: "1rem",    // 16px  
    large: "2rem"      // 32px
  },
  
  cards: {
    size: "w-16 h-22",
    spacing: "gap-1"
  },
  
  colors: {
    mantles: {
      bot: "bg-gradient-to-br from-red-600 to-red-800 border-red-500",
      human: "bg-gradient-to-br from-green-600 to-green-800 border-green-500"
    },
    backgrounds: {
      stone: "bg-gradient-to-br from-stone-600 via-stone-700 to-stone-800",
      info: "bg-black/60 backdrop-blur-sm border-purple-600/30"
    }
  }
};

// Utility functions - Pure functions only
export const getZoneConfig = (zoneName: string) => {
  return CLEAN_LAYOUT_CONFIG.gridAreas.zones[zoneName];
};

export const getZoneStyles = (zoneName: string): React.CSSProperties => {
  const zone = getZoneConfig(zoneName);
  if (!zone) return {};
  
  return {
    display: 'flex',
    justifyContent: zone.justifyContent,
    alignItems: zone.alignItems,
    flexDirection: zone.flexDirection as any,
    gap: zone.gap,
    padding: zone.padding
  };
};