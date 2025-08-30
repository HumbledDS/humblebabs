// Configuration des couleurs pour le système de thème
export const themeColors = {
  // Couleurs de base
  primary: {
    light: 'rgb(59 130 246)', // blue-500
    dark: 'rgb(96 165 250)',  // blue-400
  },
  
  // Couleurs de fond
  background: {
    light: {
      primary: 'rgb(248 250 252)',    // slate-50
      secondary: 'rgb(241 245 249)',  // slate-100
      tertiary: 'rgb(226 232 240)',   // slate-200
      card: 'rgb(255 255 255)',       // white
      accent: 'rgb(239 246 255)',     // blue-50
    },
    dark: {
      primary: 'rgb(15 23 42)',       // slate-900
      secondary: 'rgb(30 41 59)',     // slate-800
      tertiary: 'rgb(51 65 85)',      // slate-700
      card: 'rgb(30 41 59)',          // slate-800
      accent: 'rgb(30 41 59)',        // slate-800
    }
  },
  
  // Couleurs de texte
  text: {
    light: {
      primary: 'rgb(15 23 42)',       // slate-900
      secondary: 'rgb(51 65 85)',     // slate-700
      tertiary: 'rgb(100 116 139)',   // slate-500
      muted: 'rgb(148 163 184)',      // slate-400
      inverse: 'rgb(255 255 255)',    // white
    },
    dark: {
      primary: 'rgb(248 250 252)',    // slate-50
      secondary: 'rgb(226 232 240)',  // slate-200
      tertiary: 'rgb(203 213 225)',   // slate-300
      muted: 'rgb(148 163 184)',     // slate-400
      inverse: 'rgb(15 23 42)',      // slate-900
    }
  },
  
  // Couleurs d'accent
  accent: {
    light: {
      blue: 'rgb(59 130 246)',        // blue-500
      purple: 'rgb(147 51 234)',      // violet-600
      green: 'rgb(34 197 94)',        // green-500
      orange: 'rgb(249 115 22)',      // orange-500
      red: 'rgb(239 68 68)',          // red-500
    },
    dark: {
      blue: 'rgb(96 165 250)',        // blue-400
      purple: 'rgb(167 139 250)',     // violet-400
      green: 'rgb(74 222 128)',       // green-400
      orange: 'rgb(251 146 60)',      // orange-400
      red: 'rgb(248 113 113)',        // red-400
    }
  },
  
  // Couleurs de bordure
  border: {
    light: {
      primary: 'rgb(226 232 240)',    // slate-200
      secondary: 'rgb(203 213 225)',  // slate-300
      accent: 'rgb(59 130 246)',      // blue-500
    },
    dark: {
      primary: 'rgb(51 65 85)',       // slate-700
      secondary: 'rgb(71 85 105)',    // slate-600
      accent: 'rgb(96 165 250)',      // blue-400
    }
  },
  
  // Couleurs d'état
  state: {
    light: {
      hover: 'rgb(241 245 249)',      // slate-100
      active: 'rgb(226 232 240)',     // slate-200
      focus: 'rgb(59 130 246)',       // blue-500
      disabled: 'rgb(226 232 240)',   // slate-200
    },
    dark: {
      hover: 'rgb(51 65 85)',         // slate-700
      active: 'rgb(71 85 105)',       // slate-600
      focus: 'rgb(96 165 250)',       // blue-400
      disabled: 'rgb(51 65 85)',      // slate-700
    }
  }
}

// Fonction utilitaire pour obtenir les couleurs selon le thème
export function getThemeColors(isDark: boolean = false) {
  return {
    primary: isDark ? themeColors.primary.dark : themeColors.primary.light,
    background: isDark ? themeColors.background.dark : themeColors.background.light,
    text: isDark ? themeColors.text.dark : themeColors.text.light,
    accent: isDark ? themeColors.accent.dark : themeColors.accent.light,
    border: isDark ? themeColors.border.dark : themeColors.border.light,
    state: isDark ? themeColors.state.dark : themeColors.state.light,
  }
}

// Classes CSS prédéfinies pour les composants
export const themeClasses = {
  // Conteneurs
  container: {
    primary: 'bg-white dark:bg-slate-800',
    secondary: 'bg-slate-50 dark:bg-slate-900',
    accent: 'bg-blue-50 dark:bg-slate-800',
    card: 'bg-white dark:bg-slate-800 shadow-lg rounded-2xl',
  },
  
  // Textes
  text: {
    primary: 'text-slate-900 dark:text-slate-50',
    secondary: 'text-slate-700 dark:text-slate-200',
    tertiary: 'text-slate-500 dark:text-slate-400',
    muted: 'text-slate-400 dark:text-slate-500',
    inverse: 'text-white dark:text-slate-900',
    accent: 'text-blue-600 dark:text-blue-400',
  },
  
  // Boutons
  button: {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300',
    ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400',
  },
  
  // Bordures
  border: {
    primary: 'border-slate-200 dark:border-slate-700',
    secondary: 'border-slate-300 dark:border-slate-600',
    accent: 'border-blue-500 dark:border-blue-400',
  },
  
  // États
  state: {
    hover: 'hover:bg-slate-100 dark:hover:bg-slate-700',
    focus: 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900',
    active: 'bg-slate-200 dark:bg-slate-600',
  }
}
