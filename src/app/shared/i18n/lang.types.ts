export const SUPPORTED_LANGS = ['es', 'en'] as const;
export type LangCode = (typeof SUPPORTED_LANGS)[number];
