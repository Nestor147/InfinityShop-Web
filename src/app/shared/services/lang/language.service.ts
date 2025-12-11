import { Injectable, signal } from '@angular/core';
import { DEFAULT_LANG, LANG_STORAGE_KEY } from '../../i18n/lang.config';
import { LangCode, SUPPORTED_LANGS } from '../../i18n/lang.types';

@Injectable({ providedIn: 'root' })
export class LangService {
  private readonly _lang = signal<LangCode>(this.readInitialLang());
  readonly lang = this._lang.asReadonly();

  setLang(lang: LangCode) {
    if (!SUPPORTED_LANGS.includes(lang)) return;
    this._lang.set(lang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch { }
    try {
      document.documentElement.lang = lang;
    } catch { }
  }

  private readInitialLang(): LangCode {
    try {
      const stored = localStorage.getItem(LANG_STORAGE_KEY) as LangCode | null;
      if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
    } catch { }
    return DEFAULT_LANG;
  }
}
