import { Injectable, signal } from '@angular/core';
import { MenuItemInterface, MenuSection } from '../../models/main-menu-bus/menu-section.interface';

@Injectable({ providedIn: 'root' })
export class MainMenuBusService {
  private _root = signal<MenuSection[]>([]);
  sections = this._root.asReadonly();

  set(sections: MenuSection[]) { this._root.set(sections ?? []); }
  clear() { this._root.set([]); }
}
