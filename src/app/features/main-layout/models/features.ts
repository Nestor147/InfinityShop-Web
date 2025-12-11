import { MenuItemInterface } from "../../../shared/models/main-menu-bus/menu-section.interface";

export interface Feature {
  name: string;
  icon: string;
  route?: string | any[];
  hasChildren: boolean;
  children?: MenuItemInterface[] | null;
  sectionTitle?: string;
}
