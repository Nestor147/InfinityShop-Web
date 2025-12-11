import { SUPPORTED_LANGS, type LangCode } from './lang.types';
import { DEFAULT_LANG } from './lang.config';

declare const ngDevMode: boolean | undefined;

export function debugMissingLangs<T extends object>(
    scope: string,
    dict: Record<LangCode, T>,
    fallback: LangCode = DEFAULT_LANG
) {
    if (typeof ngDevMode === 'undefined' || !ngDevMode) return;

    const base = dict[fallback];
    if (!base) {
        console.warn('[i18n] Fallback language block missing', { scope, fallback });
        return;
    }

    const keys = Object.keys(base) as (keyof T)[];

    for (const lang of SUPPORTED_LANGS) {
        const block = dict[lang];
        if (!block) {
            console.warn('[i18n] Missing language block', { scope, lang });
            continue;
        }

        for (const key of keys) {
            const v = (block as any)[key];
            if (v === undefined || v === null || v === '') {
                console.warn('[i18n] Missing translation', {
                    scope,
                    lang,
                    key: String(key),
                });
            }
        }
    }
}
