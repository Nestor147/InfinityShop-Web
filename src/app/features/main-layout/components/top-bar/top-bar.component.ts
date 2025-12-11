// src/app/features/layout/components/top-bar/top-bar.component.ts
import {
  CommonModule
} from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  signal,
  computed,
  inject
} from '@angular/core';

import { ThemeService } from '../../../../shared/services/theme/theme.service';
import { LangService } from '../../../../shared/services/lang/language.service';
import { LangCode } from '../../../../shared/i18n/lang.types';
import { SvgIconComponent } from 'angular-svg-icon';

import { TOP_BAR_TEXTS, TopBarTexts } from './top-bar.i18n';

interface LangOption {
  code: LangCode;
  label: string;
}

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, SvgIconComponent],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent {
  @Input() brand = 'Administración de Sistemas';
  @Input() envLabel?: string;
  @Input() userName = 'Superadmin';
  @Input() avatarText = 'SA';

  @Output() menuToggle = new EventEmitter<void>();
  @Output() action = new EventEmitter<string>();
  @Output() userAction = new EventEmitter<string>();

  launcherOpen = signal(false);
  userOpen = signal(false);
  langMenuOpen = signal(false);

  #theme = inject(ThemeService);
  #lang = inject(LangService);

  isDarkMode = computed(() => this.#theme.isDark());

  lang = computed<LangCode>(() => this.#lang.lang());
  t = computed<TopBarTexts>(() => TOP_BAR_TEXTS[this.lang()]);

  currentLangLabel = computed(
    () => TOP_BAR_TEXTS[this.lang()].langButtonLabel
  );

  readonly languages: LangOption[] = Object.entries(TOP_BAR_TEXTS).map(
    ([code, texts]) => ({
      code: code as LangCode,
      label: texts.langButtonLabel
    })
  );

  private closeAll() {
    this.launcherOpen.set(false);
    this.userOpen.set(false);
    this.langMenuOpen.set(false);
  }

  @HostListener('document:keydown', ['$event'])
  onKey(ev: KeyboardEvent) {
    if (ev.key === 'Escape') this.closeAll();
  }

  @HostListener('document:click', ['$event'])
  closeOnOutside(ev: MouseEvent) {
    const el = ev.target as HTMLElement | null;
    if (!el) return;
    if (el.closest('[data-menu-root]')) return;
    this.closeAll();
  }

  onToggleLauncher(event: MouseEvent) {
    event.stopPropagation();
    const next = !this.launcherOpen();
    this.launcherOpen.set(next);
    if (next) {
      this.userOpen.set(false);
      this.langMenuOpen.set(false);
    }
  }

  onToggleUser(event: MouseEvent) {
    event.stopPropagation();
    const next = !this.userOpen();
    this.userOpen.set(next);
    if (next) {
      this.launcherOpen.set(false);
      this.langMenuOpen.set(false);
    }
  }

  onToggleLang(event: MouseEvent) {
    event.stopPropagation();
    const next = !this.langMenuOpen();
    this.langMenuOpen.set(next);
    if (next) {
      this.launcherOpen.set(false);
      this.userOpen.set(false);
    }
  }

  changeLang(lang: LangCode) {
    if (lang === this.lang()) return;
    this.#lang.setLang(lang);
  }

  toggleDarkMode() {
    this.#theme.toggle();
  }
}
