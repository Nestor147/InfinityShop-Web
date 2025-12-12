import { CellContent } from "./response-master-table.interface";

export type ButtonSeverity =
  | 'help' | 'danger' | 'info' | 'secondary' | 'success'
  | 'warn' | 'primary' | 'contrast';

export interface ActionMeta {
  icon: string;
  severity: ButtonSeverity | null;
  label: string;
  iconOnly: boolean;
}

export interface UiAction extends ActionMeta {
  original: CellContent ; // para emitirte lo mismo que recibes
}
