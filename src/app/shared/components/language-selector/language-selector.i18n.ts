import { LangCode } from '../../i18n/lang.types';

export interface LanguageSelectorTexts {
  ariaLabel: string;
  /** Etiqueta mostrada en el selector para cada idioma */
  label: string;
}

export const LANGUAGE_SELECTOR_TEXTS: Record<LangCode, LanguageSelectorTexts> = {
  es: {
    ariaLabel: 'Cambiar idioma',
    label: 'ES · Español'
  },
  en: {
    ariaLabel: 'Change language',
    label: 'EN · English'
  }
};
