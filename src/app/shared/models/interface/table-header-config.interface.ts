import { DropdownOption } from "./dropdown-option.interface";

export interface TableHeaderConfig {
  title: string;
  searchPlaceholder: string;
  dropdownOptions: DropdownOption[];
  showDropdown: boolean;
  showAddButton: boolean;
  hasVendorQr?: boolean;
  qrLoading?: boolean;
  disableAddButton?: boolean;
  addButtonText?: string;
  dropdownLabel?: string;
  showSearch?: boolean;
  showPixOption?: boolean;
  pixButtonText?: string;
  addButtonIcon?: string;
  customButtonText?: string;
  customButtonIcon?: string;
  customButtonAction?: () => void;
}
