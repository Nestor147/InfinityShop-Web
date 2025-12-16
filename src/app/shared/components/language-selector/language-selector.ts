import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LangService } from '../../services/lang/language.service';
import { LangCode, SUPPORTED_LANGS } from '../../i18n/lang.types';
import { LANGUAGE_SELECTOR_TEXTS, LanguageSelectorTexts } from './language-selector.i18n';

interface LangOption {
  code: LangCode;
  label: string;
}

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative inline-flex items-center">
      <span
        class="pointer-events-none absolute left-2.5 inset-y-0 flex items-center text-[13px]
               text-slate-400 dark:text-sa-text/60"
      >
        <i class="ri-translate-2"></i>
      </span>

      <select
        [ngModel]="lang()"
        (ngModelChange)="changeLang($event)"
        [ngModelOptions]="{ standalone: true }"
        [attr.aria-label]="t().ariaLabel"
        class="appearance-none rounded-xl pl-8 pr-7 py-2
               text-xs font-medium cursor-pointer
               ring-1 ring-white/10
               bg-transparent text-sa-text/80
               hover:ring-sa-accent/70 hover:bg-white/5
               focus:outline-none focus-visible:ring-2 focus-visible:ring-sa-accent
               transition"
      >
        @for (option of languages; track option.code) {
          <option
            [ngValue]="option.code"
            [disabled]="option.code === lang()"
            class="bg-sa-black text-sa-text"
          >
            {{ option.label }}
          </option>
        }
      </select>

      <span
        class="pointer-events-none absolute right-2.5 inset-y-0 flex items-center text-[13px]
               text-slate-400 dark:text-sa-text/60"
      >
        <i class="ri-arrow-down-s-line"></i>
      </span>
    </div>
  `
})
export class LanguageSelectorComponent {
  readonly #langService = inject(LangService);

  /** Computed del idioma actual desde el LangService */
  readonly lang = computed<LangCode>(() => this.#langService.lang());

  /** Computed de los textos traducidos del selector */
  readonly t = computed<LanguageSelectorTexts>(() => LANGUAGE_SELECTOR_TEXTS[this.lang()]);

  /** Lista de idiomas disponibles con sus etiquetas traducidas */
  readonly languages: LangOption[] = SUPPORTED_LANGS.map((code) => ({
    code,
    label: LANGUAGE_SELECTOR_TEXTS[code].label
  }));

  /**
   * Cambia el idioma de toda la aplicación
   * @param lang - Código del idioma seleccionado
   */
  changeLang(lang: string | LangCode): void {
    this.#langService.setLang(lang as LangCode);
  }
}
