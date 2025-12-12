import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableHeaderConfig } from '../../models/interface/table-header-config.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-header',
  imports: [CommonModule, FormsModule],
  templateUrl: './table-header.html',
  styleUrl: './table-header.scss',
})
export class TableHeader {
  
  @Input() config: TableHeaderConfig = {
    title: '',
    searchPlaceholder: 'Search...',
    dropdownOptions: [],
    showDropdown: false,
    showAddButton: false,
    showSearch: true,
    showPixOption: true,
    hasVendorQr: false,
    qrLoading: false,
    disableAddButton: false,
    addButtonText: 'Add',
    pixButtonText: 'Add Pix'
  };

  @Input() searchFilter: string = '';
  @Input() selectedDropdownValue: any;

  @Output() searchChange = new EventEmitter<string>();
  @Output() dropdownChange = new EventEmitter<any>();
  @Output() addButtonClick = new EventEmitter<void>();
  @Output() contactSellerClick = new EventEmitter<void>();
  @Output() customButtonClick = new EventEmitter<void>();

  onSearchChange(value: string) {
    this.searchChange.emit(value);
  }

  onDropdownChange(value: any) {
    this.dropdownChange.emit(value);
  }

  onAddButtonClick() {
    this.addButtonClick.emit();
  }

  onContactSellerClick() {
    this.contactSellerClick.emit();
  }

  onCustomButtonClick() {
    if (this.config.customButtonAction) {
      this.config.customButtonAction();
    }
    this.customButtonClick.emit();
  }
}
