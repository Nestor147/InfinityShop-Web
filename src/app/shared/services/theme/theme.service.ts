import { Injectable, signal } from '@angular/core';

type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private isDarkSignal = signal<boolean>(false);
  readonly isDark = this.isDarkSignal.asReadonly();

  constructor() {
    const stored = (localStorage.getItem(STORAGE_KEY) as ThemeMode | null);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const startDark =
      stored === 'dark' ||
      (!stored && prefersDark);

    this.apply(startDark);
  }

  toggle() {
    this.apply(!this.isDarkSignal());
  }

  private apply(dark: boolean) {
    this.isDarkSignal.set(dark);

    const root = document.documentElement;
    root.classList.toggle('dark', dark);

    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
  }
}
