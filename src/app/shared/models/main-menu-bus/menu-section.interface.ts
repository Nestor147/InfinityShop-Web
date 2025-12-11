export interface MenuSection {
  title?: string;
  menuItems: Array<MenuItemInterface>;
}
export interface MenuItemInterface {
  icon?: string;
  title: string;
  url?: string | any[];
  external?: boolean;
  children?: MenuItemInterface[];
  badge?: string | number;
  mode?: 'accordion' | 'drawer';
}

