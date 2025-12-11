import { Component, HostListener, inject, signal, effect, computed} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SvgIconComponent } from 'angular-svg-icon';
import { TopBarComponent } from '../../components/top-bar/top-bar.component';
import { BtnSystemComponent } from '../../components/btn-system/btn-system.component';
import { MenuItemInterface } from '../../../../shared/models/main-menu-bus/menu-section.interface';
import { MainMenuBusService } from '../../../../shared/services/menu/main-menu-bus.service';
import { menu_data_reports } from '../../../reports/models/menu.data';
import { Feature } from '../../models/features';
import { AuthService } from '../../../../core/auth/auth.service';
import { LangService } from '../../../../shared/services/lang/language.service';
import { LangCode } from '../../../../shared/i18n/lang.types';
import { MAIN_LAYOUT_TEXTS, MainLayoutTexts } from './main-layout.i18n';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SvgIconComponent, TopBarComponent, BtnSystemComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export default class MainLayoutComponent {
  isLoading = signal(false);
  menuOpen = true;
  isMobile = false;

  submenuOpen = signal(false);
  submenuTitle = signal('');
  submenuItems: MenuItemInterface[] = [];
  submenuBase = signal<string>('/dashboard');

  menuBusService = inject(MainMenuBusService);
  #router = inject(Router);
  #auth = inject(AuthService);

  #lang = inject(LangService);
  lang = computed<LangCode>(() => this.#lang.lang());
  t = computed<MainLayoutTexts>(() => MAIN_LAYOUT_TEXTS[this.lang()]);

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
      if (url.startsWith('/dashboard') && flat.length) {
        this.submenuTitle.set(sections[0]?.title || this.t().submenuMainLabel);
        this.submenuItems = flat;
        this.submenuBase.set('/dashboard');
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

  onOpenSubmenu(
    payload: { title?: string; items: MenuItemInterface[] },
    basePath?: string
  ) {
    const sections = this.menuBusService.sections?.() ?? [];
    const fallbackTitle = sections[0]?.title || this.t().submenuMainLabel;

    this.submenuTitle.set(payload?.title ?? fallbackTitle);
    this.submenuItems = payload?.items ?? [];
    this.submenuBase.set(basePath || '/dashboard');
    this.submenuOpen.set(true);
  }

  closeSubmenu() {
    this.submenuOpen.set(false);
    this.expandedKeys.clear();
    this.expandedLv3.clear();

    if (this.currentUrl().startsWith(this.submenuBase())) {
      this.#router.navigate(['/dashboard']);
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
    { name: 'Inicio', icon: '/assets/icons/icon-home.svg', route: 'dashboard', hasChildren: false },
    { name: 'Gestionar Aplicaciones', icon: '/assets/icons/icon-applications.svg', route: 'applications', hasChildren: false },
    { name: 'Gestionar Roles', icon: '/assets/icons/icon-managment-roles.svg', hasChildren: false, route: 'managment-roles' },
    { name: 'Menu', icon: '/assets/icons/icon-menu.svg', route: 'menu', hasChildren: false },
    { name: 'Asignar Pag. a Roles', icon: '/assets/icons/icon-pag-roles.svg', route: 'assing-pages-roles', hasChildren: false },
    { name: 'Asignar Roles', icon: '/assets/icons/icon-roles.svg', route: 'assing-roles', hasChildren: false },
    { name: 'Gestion de Puntos', icon: '/assets/icons/icon-points.svg', route: 'points', hasChildren: false },
    { name: 'Reportes', icon: '/assets/icons/icon-reports.svg', hasChildren: true, route: 'reports',
      sectionTitle: menu_data_reports[0]?.title,
      children: menu_data_reports[0]?.menuItems ?? []
    }
  ];

  featureName(f: Feature): string {
    const ft = this.t().features;
    const r = Array.isArray(f.route) ? f.route.join('/') : f.route;

    switch (r) {
      case 'dashboard':
        return ft.home;
      case 'applications':
        return ft.applications;
      case 'managment-roles':
        return ft.roles;
      case 'menu':
        return ft.menu;
      case 'assing-pages-roles':
        return ft.assignPagesRoles;
      case 'assing-roles':
        return ft.assignRoles;
      case 'points':
        return ft.points;
      case 'reports':
        return ft.reports;
      default:
        return f.name;
    }
  }

  menuTitle(raw: string | undefined | null): string {
    const v = (raw ?? '').trim();
    if (!v) return '';

    const rm = this.t().reportsMenu;

    switch (v) {
      case 'Reportes':
        return rm.section;
      case 'Roles por Usuario':
        return rm.rolesByUser;
      case 'Usuarios por Rol':
        return rm.usersByRole;
      case 'Menu de Rol':
        return rm.menuByRole;
      case 'Menu de Persona':
        return rm.menuByPerson;
      case 'Administrador':
        return rm.admin;
      case 'Listado':
        return rm.adminList;
      case 'Crear':
        return rm.adminCreate;
      case 'Mensual':
        return rm.adminMonthly;
      case 'Por usuario':
        return rm.adminByUser;
      case 'Auditoría':
        return rm.adminAudit;
      default:
        return v;
    }
  }

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
      const path =
        '/' +
        cmd
          .flat()
          .filter(Boolean)
          .join('/')
          .replace(/^\/+/, '');
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

  grandChildLinkInline(
    p: MenuItemInterface,
    c: MenuItemInterface,
    g: MenuItemInterface
  ) {
    const base = this.submenuBase();
    const pv = Array.isArray(p.url) ? p.url : [p.url ?? ''];
    const cv = Array.isArray(c.url) ? c.url : [c.url ?? ''];
    const gv = Array.isArray(g.url) ? g.url : [g.url ?? ''];

    return [
      base,
      ...pv.filter(Boolean),
      ...cv.filter(Boolean),
      ...gv.filter(Boolean)
    ];
  }

  baseForFeature(f: Feature): string {
    const r = f?.route;
    if (!r) return '/';
    const path = Array.isArray(r) ? r.filter(Boolean).join('/') : r;
    return '/' + String(path).replace(/^\/+/, '');
  }
}
