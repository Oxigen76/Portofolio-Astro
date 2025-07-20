/**
 * Enhanced Theme Management System
 * Handles theme persistence, system detection, and smooth transitions
 */

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeConfig {
  storageKey: string;
  attribute: string;
  enableTransitions: boolean;
  transitionDuration: number;
  enableSystemDetection: boolean;
}

export interface ThemeChangeEvent {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  previousTheme: Theme;
  previousResolvedTheme: ResolvedTheme;
}

export class ThemeManager {
  private config: ThemeConfig;
  private currentTheme: Theme = 'system';
  private resolvedTheme: ResolvedTheme = 'light';
  private mediaQuery: MediaQueryList | null = null;
  private listeners: Set<(event: ThemeChangeEvent) => void> = new Set();

  constructor(config: Partial<ThemeConfig> = {}) {
    this.config = {
      storageKey: 'theme-preference',
      attribute: 'data-theme',
      enableTransitions: true,
      transitionDuration: 300,
      enableSystemDetection: true,
      ...config,
    };

    this.initialize();
  }

  /**
   * Initialize theme manager
   */
  private initialize(): void {
    if (typeof window === 'undefined') return;

    // Set up system theme detection
    if (this.config.enableSystemDetection) {
      this.setupSystemDetection();
    }

    // Load saved theme or detect system preference
    const savedTheme = this.getSavedTheme();
    const initialTheme = savedTheme || 'system';
    
    this.setTheme(initialTheme, false); // Don't save on initialization
  }

  /**
   * Set up system theme detection
   */
  private setupSystemDetection(): void {
    if (typeof window === 'undefined') return;

    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Listen for system theme changes
    this.mediaQuery.addEventListener('change', (e) => {
      if (this.currentTheme === 'system') {
        this.updateResolvedTheme();
        this.applyTheme();
        this.notifyListeners();
      }
    });
  }

  /**
   * Get saved theme from localStorage
   */
  private getSavedTheme(): Theme | null {
    if (typeof localStorage === 'undefined') return null;
    
    try {
      const saved = localStorage.getItem(this.config.storageKey);
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        return saved as Theme;
      }
    } catch (error) {
      console.warn('Failed to read theme from localStorage:', error);
    }
    
    return null;
  }

  /**
   * Save theme to localStorage
   */
  private saveTheme(theme: Theme): void {
    if (typeof localStorage === 'undefined') return;
    
    try {
      localStorage.setItem(this.config.storageKey, theme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }

  /**
   * Update resolved theme based on current theme and system preference
   */
  private updateResolvedTheme(): void {
    if (this.currentTheme === 'system') {
      this.resolvedTheme = this.getSystemTheme();
    } else {
      this.resolvedTheme = this.currentTheme;
    }
  }

  /**
   * Get system theme preference
   */
  private getSystemTheme(): ResolvedTheme {
    if (typeof window === 'undefined') return 'light';
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /**
   * Apply theme to document
   */
  private applyTheme(): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    
    // Enable transitions if configured
    if (this.config.enableTransitions) {
      this.enableTransitions();
    }

    // Set theme attribute
    root.setAttribute(this.config.attribute, this.resolvedTheme);
    
    // Add/remove dark class for compatibility
    if (this.resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Update meta theme-color
    this.updateMetaThemeColor();
  }

  /**
   * Enable smooth transitions
   */
  private enableTransitions(): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    
    // Add transition class
    root.classList.add('theme-transition');
    
    // Remove transition class after animation
    setTimeout(() => {
      root.classList.remove('theme-transition');
    }, this.config.transitionDuration);
  }

  /**
   * Update meta theme-color based on current theme
   */
  private updateMetaThemeColor(): void {
    if (typeof document === 'undefined') return;

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const color = this.resolvedTheme === 'dark' ? '#0f172a' : '#ffffff';
      metaThemeColor.setAttribute('content', color);
    }
  }

  /**
   * Notify all listeners of theme change
   */
  private notifyListeners(): void {
    const event: ThemeChangeEvent = {
      theme: this.currentTheme,
      resolvedTheme: this.resolvedTheme,
      previousTheme: this.currentTheme,
      previousResolvedTheme: this.resolvedTheme,
    };

    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.warn('Theme change listener error:', error);
      }
    });
  }

  /**
   * Set theme
   */
  public setTheme(theme: Theme, save: boolean = true): void {
    const previousTheme = this.currentTheme;
    const previousResolvedTheme = this.resolvedTheme;

    this.currentTheme = theme;
    this.updateResolvedTheme();
    this.applyTheme();

    if (save) {
      this.saveTheme(theme);
    }

    // Notify listeners with previous values
    const event: ThemeChangeEvent = {
      theme: this.currentTheme,
      resolvedTheme: this.resolvedTheme,
      previousTheme,
      previousResolvedTheme,
    };

    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.warn('Theme change listener error:', error);
      }
    });
  }

  /**
   * Get current theme
   */
  public getTheme(): Theme {
    return this.currentTheme;
  }

  /**
   * Get resolved theme (actual theme being displayed)
   */
  public getResolvedTheme(): ResolvedTheme {
    return this.resolvedTheme;
  }

  /**
   * Toggle between light and dark themes
   */
  public toggleTheme(): void {
    const newTheme = this.resolvedTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Check if system theme detection is supported
   */
  public isSystemThemeSupported(): boolean {
    return typeof window !== 'undefined' && 
           window.matchMedia && 
           window.matchMedia('(prefers-color-scheme)').media !== 'not all';
  }

  /**
   * Add theme change listener
   */
  public addListener(listener: (event: ThemeChangeEvent) => void): () => void {
    this.listeners.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Remove theme change listener
   */
  public removeListener(listener: (event: ThemeChangeEvent) => void): void {
    this.listeners.delete(listener);
  }

  /**
   * Get all available themes
   */
  public getAvailableThemes(): Theme[] {
    const themes: Theme[] = ['light', 'dark'];
    
    if (this.isSystemThemeSupported()) {
      themes.push('system');
    }
    
    return themes;
  }

  /**
   * Reset to system default
   */
  public reset(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(this.config.storageKey);
      } catch (error) {
        console.warn('Failed to remove theme from localStorage:', error);
      }
    }
    
    this.setTheme('system', false);
  }

  /**
   * Destroy theme manager and cleanup
   */
  public destroy(): void {
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', this.setupSystemDetection);
    }
    
    this.listeners.clear();
  }
}