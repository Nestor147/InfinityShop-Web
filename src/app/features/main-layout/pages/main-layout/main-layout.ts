import { Component, HostListener, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SvgIconComponent } from 'angular-svg-icon';
import { TopBar } from '../../components/top-bar/top-bar';
import { BtnSystem } from '../../components/btn-system/btn-system';
import { MenuItemInterface } from '../../../../shared/models/main-menu-bus/menu-section.interface';
import { MainMenuBusService } from '../../../../shared/services/menu/main-menu-bus.service';
import { Feature } from '../../models/features';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, RouterModule, SvgIconComponent, TopBar, BtnSystem],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export default class MainLayout {
  isLoading = signal(false);
  menuOpen = true;
  isMobile = false;

  submenuOpen = signal(false);
  submenuTitle = signal('');
  submenuItems: MenuItemInterface[] = [];
  submenuBase = signal<string>('/');

  menuBusService = inject(MainMenuBusService);
  #router = inject(Router);
  #auth = inject(AuthService);
  currentUrl = signal(this.#router.url);

  private expandedKeys = new Set<string>();
  private expandedLv3 = new Set<string>();

  constructor() {
    this.checkScreenSize();

    this.#router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.currentUrl.set(e.urlAfterRedirects);
        if (!this.currentUrl().startsWith(this.submenuBase())) {
          if (this.submenuOpen()) this.submenuOpen.set(false);
          this.expandedKeys.clear();
          this.expandedLv3.clear();
        }
      });

    effect(() => {
      const sections = this.menuBusService.sections();
      const url = this.currentUrl();
      const flat = sections.flatMap((s) => s.menuItems);
      if (url.startsWith('/') && flat.length) {
        this.submenuTitle.set(sections[0]?.title || 'MENÚ');
        this.submenuItems = flat;
        this.submenuBase.set('/');
        this.submenuOpen.set(true);
      }
    });
  }

  @HostListener('window:resize', [])
  checkScreenSize() {
    this.isMobile = window.innerWidth < 1024;
    this.menuOpen = !this.isMobile;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  onOpenSubmenu(payload: { title?: string; items: MenuItemInterface[] }, basePath?: string) {
    const sections = this.menuBusService.sections?.() ?? [];
    const fallbackTitle = sections[0]?.title || 'MENÚ';
    this.submenuTitle.set(payload?.title ?? fallbackTitle);
    this.submenuItems = payload?.items ?? [];
    this.submenuBase.set(basePath || '/');
    this.submenuOpen.set(true);
  }

  closeSubmenu() {
    this.submenuOpen.set(false);
    this.expandedKeys.clear();
    this.expandedLv3.clear();
    if (this.currentUrl().startsWith(this.submenuBase())) {
      this.#router.navigate(['/']);
    }
  }

  onUserAction(action: string) {
    if (action === 'logout') {
      this.#auth.logout();
      return;
    }

    if (action === 'profile') {

    }
  }

  public features: Feature[] = [
    { name: 'Inicio', icon: '/assets/icons/icon-home.svg', route: '', hasChildren: false },
    { name: 'Gestionar Aplicaciones', icon: '/assets/icons/icon-applications.svg', route: 'applications', hasChildren: false },
    { name: 'Products', icon: '/assets/icons/icon-applications.svg', route: 'products', hasChildren: false },
  ];

  keyFor(it: MenuItemInterface) {
    return `${it.title}::${Array.isArray(it.url) ? it.url.join('/') : it.url ?? ''}`;
  }

  isExpanded(it: MenuItemInterface) {
    return this.expandedKeys.has(this.keyFor(it));
  }

  toggleAccordion(it: MenuItemInterface) {
    const k = this.keyFor(it);
    if (this.expandedKeys.has(k)) this.expandedKeys.delete(k);
    else this.expandedKeys.add(k);
  }

  isGroupActive(group: MenuItemInterface) {
    if (!group.children?.length) return false;
    const base = this.submenuBase();
    const current = this.currentUrl();
    return group.children.some((ch) => {
      const cmd = Array.isArray(ch.url) ? [base, ...ch.url] : [base, ch.url ?? ''];
      const path = '/' + cmd.flat().filter(Boolean).join('/').replace(/^\/+/, '');
      return current.startsWith(path);
    });
  }

  childLink(ch: MenuItemInterface) {
    const base = this.submenuBase();
    return Array.isArray(ch.url) ? [base, ...ch.url] : [base, ch.url ?? ''];
  }

  private keyLv3(p: MenuItemInterface, c: MenuItemInterface) {
    const pk = `${p.title}::${Array.isArray(p.url) ? p.url.join('/') : p.url ?? ''}`;
    const ck = `${c.title}::${Array.isArray(c.url) ? c.url.join('/') : c.url ?? ''}`;
    return `${pk}=>${ck}`;
  }

  isLv3Expanded(p: MenuItemInterface, c: MenuItemInterface) {
    return this.expandedLv3.has(this.keyLv3(p, c));
  }

  toggleLv3Inline(p: MenuItemInterface, c: MenuItemInterface) {
    const k = this.keyLv3(p, c);
    if (this.expandedLv3.has(k)) this.expandedLv3.delete(k);
    else this.expandedLv3.add(k);
  }

  grandChildLinkInline(p: MenuItemInterface, c: MenuItemInterface, g: MenuItemInterface) {
    const base = this.submenuBase();
    const pv = Array.isArray(p.url) ? p.url : [p.url ?? ''];
    const cv = Array.isArray(c.url) ? c.url : [c.url ?? ''];
    const gv = Array.isArray(g.url) ? g.url : [g.url ?? ''];
    return [base, ...pv.filter(Boolean), ...cv.filter(Boolean), ...gv.filter(Boolean)];
  }

  baseForFeature(f: Feature): string {
    const r = f?.route;
    if (!r) return '/';
    const path = Array.isArray(r) ? r.filter(Boolean).join('/') : r;
    return '/' + String(path).replace(/^\/+/, '');
  }
}
