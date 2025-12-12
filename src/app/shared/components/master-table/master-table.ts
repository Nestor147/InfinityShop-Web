import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cell, CellContent, MasterTableResponse } from '../../models/interface/response-master-table.interface';
import { ActionMeta, UiAction } from '../../models/interface/action-meta.interface';

@Component({
  selector: 'app-master-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './master-table.html',
  styleUrl: './master-table.scss',
})
export class MasterTable implements OnChanges {
  @Input() data!: MasterTableResponse;
  @Input() actionMapOverride?: Record<string, Partial<ActionMeta>>;

  @Output() click = new EventEmitter<any>();
  @Output() paginationChange = new EventEmitter<{ pageNumber: number; pageSize: number }>();

  // #productVariationService = inject(ProductVariationService);

  displayedColumns: string[] = [];
  imageColumns: string[] = [];
  tableData: any[] = [];

  selectedImage: string | null = null;
  showImageDialog = false;

  totalRecords = 0;
  rows = 10;
  page = 0;

  // Backend messages
  backendMessages: { type: string; description: string }[] = [];

  // Variables for inline editing
  editingCell: { rowIndex: number; col: string; action: CellContent } | null = null;
  editingValue: string = '';
  validationError: string = '';
  saving = false;

  // Sorting
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.tableData = [];
      this.displayedColumns = [];
      this.imageColumns = [];
      this.backendMessages = [];

      console.log('MasterTable - received data:', this.data);

      // Capture backend messages
      if (this.data?.messages?.length) {
        this.backendMessages = this.data.messages;
        console.log('MasterTable - captured messages:', this.backendMessages);
      }

      console.log('MasterTable - tableData.length:', this.tableData.length);
      console.log('MasterTable - backendMessages.length:', this.backendMessages.length);

      if (this.data?.data?.length) {
        this.displayedColumns = this.getDisplayedColumns(this.data.data);
        this.tableData = this.transformTableData(this.data.data);

        this.displayedColumns.forEach(col => {
          const hasImage = (this.data.data ?? []).some(row =>
            row.some(cell =>
              cell.columnName === col &&
              (cell.cellContent ?? []).some(cc => (cc.contentType || '').toLowerCase() === 'image')
            )
          );
          if (hasImage) this.imageColumns.push(col);
        });
      }

      if (this.data?.pagination) {
        this.totalRecords = this.data.pagination.totalRecords;
        this.rows = this.data.pagination.pageSize;
        this.page = (this.data.pagination.currentPage ?? 1) - 1;
      }
    }
  }

  getDisplayedColumns(rows: Cell[][]): string[] {
    return rows?.[0]?.map((col: Cell) => col.columnName) || [];
  }

  // Normalize content (string | string[]) → string
  private contentText(c: CellContent | null | undefined): string {
    const v: unknown = (c as any)?.content;
    if (Array.isArray(v)) return v.join(' ').trim();
    return (v ?? '').toString().trim();
  }

  transformTableData(rows: Cell[][]): any[] {
    return rows.map(row => {
      const flatRow: any = {};
      row.forEach(col => {
        const contents = col.cellContent || [];
        const name = col.columnName;

        // Save raw array and precalculated UI actions
        flatRow[`_${name}`] = contents;
        flatRow[`__ui_${name}`] = this.mapActions(contents);

        const textOnly = contents.filter(c => (c.contentType || '').toLowerCase() === 'text');
        const images = contents.filter(c => (c.contentType || '').toLowerCase() === 'image');
        // Exclude editColumn when checking for button actions
        const hasActions = textOnly.some(c => !!c.action && c.action !== 'editColumn');
        const hasEditColumn = textOnly.some(c => c.action === 'editColumn');

        if (images.length > 0) {
          // First image as cell value
          flatRow[name] = this.contentText(images[0]);
        } else if (!hasActions) {
          // Take content without action (or first if all have action)
          const textWithoutAction = textOnly.find(c => !c.action) || textOnly[0];
          const value = textWithoutAction
            ? this.contentText(textWithoutAction)
            : textOnly.map(c => this.contentText(c)).join(' ');

          // If has editColumn, keep as string to preserve decimals
          // Otherwise, try to convert to number if applicable
          if (hasEditColumn) {
            flatRow[name] = value;
          } else {
            flatRow[name] = isNaN(Number(value)) ? value : Number(value);
          }
        } else {
          flatRow[name] = '';
        }
      });
      return flatRow;
    });
  }

  isImage(value: any): boolean {
    return typeof value === 'string' && (value.startsWith('http') || value.startsWith('data:image'));
  }

  openImage(url: string) {
    this.selectedImage = url;
    this.showImageDialog = true;
  }

  closeImageDialog() {
    this.showImageDialog = false;
    this.selectedImage = null;
  }

  // === Base mapping by keywords (extensible)
  private getActionMeta(actionName: string): ActionMeta {
    const key = (actionName || '').toLowerCase().trim();

    const base: ActionMeta = {
      icon: 'assets/icons/cog.svg',
      severity: 'secondary',
      label: actionName || 'Action',
      iconOnly: false
    };

    if (/(^| )edit|modify/.test(key))           return { icon: 'assets/icons/pencil.svg', severity: 'help',      label: 'Edit',        iconOnly: true  };
    if (/(^| )delete|remove/.test(key))         return { icon: 'assets/icons/trash.svg', severity: 'danger',    label: 'Delete',      iconOnly: true  };
    if (/view|detail/.test(key))                return { icon: 'assets/icons/eye.svg', severity: 'info',      label: 'View',        iconOnly: true  };
    if (/download/.test(key))                   return { icon: 'assets/icons/download.svg', severity: 'secondary', label: 'Download',    iconOnly: true  };
    if (/activate|enable/.test(key))            return { icon: 'assets/icons/activate.svg', severity: 'success',   label: 'Activate',    iconOnly: true  };
    if (/deactivate|disable/.test(key))         return { icon: 'assets/icons/deactivate.svg', severity: 'warn',      label: 'Deactivate',  iconOnly: true  };
    if (/(^| )add element|addElement/.test(key)) return { icon: 'assets/icons/sitemap.svg', severity: 'warn',      label: 'Add Variation', iconOnly: true  };
    if (/send order|sendOrder/.test(key))       return { icon: 'assets/icons/paper-airplane.svg', severity: 'success',   label: 'Send Order',  iconOnly: true  };

    return base;
  }

  // Convert CellContent[] → UiAction[]
  private mapActions(actions: CellContent[] | null | undefined): UiAction[] {
    if (!actions?.length) return [];
    return actions
      .filter(a => !!a.action && ((a.contentType || '').toLowerCase() === 'text'))
      .filter(a => a.action !== 'editColumn') // Exclude editColumn from button actions
      .map(a => {
        const name = this.contentText(a);
        const base = this.getActionMeta(name);

        const o = this.actionMapOverride?.[name.toLowerCase()];
        const merged: ActionMeta = o ? {
          icon: o.icon ?? base.icon,
          severity: o.severity ?? base.severity,
          label: o.label ?? base.label,
          iconOnly: o.iconOnly ?? base.iconOnly
        } : base;

        return { ...merged, original: a };
      });
  }

  // trackBy: avoid unnecessary recreations
  trackByCol = (_: number, col: string) => col;
  trackByAction = (_: number, a: UiAction) => `${a.label}|${a.icon}|${a.severity}|${a.iconOnly}`;

  onActionClick(a: UiAction, ev: MouseEvent): void {
    ev.stopPropagation();
    this.click.emit({
      cellContent: a.original,
      meta: { icon: a.icon, label: a.label }
    });
  }

  onPaginate(newPage: number): void {
    this.page = newPage;
    this.paginationChange.emit({
      pageNumber: newPage + 1,
      pageSize: this.rows
    });
  }

  onPageSizeChange(newSize: number): void {
    this.rows = newSize;
    this.page = 0;
    this.paginationChange.emit({
      pageNumber: 1,
      pageSize: newSize
    });
  }

  hasActions(actions: CellContent[]): boolean {
    return actions?.some(a => !!a.action && a.action !== 'editColumn');
  }

  // === Methods for inline editing ===

  validateValue(value: string, columnName: string): string {
    const num = parseFloat(value);

    if (value.trim() === '' || isNaN(num)) {
      return 'Must enter a valid number';
    }

    if (num < 0) {
      return 'Negative numbers not allowed';
    }

    // Validate according to column type
    if (columnName.toLowerCase().includes('stock')) {
      if (!Number.isInteger(num)) {
        return 'Stock must be an integer';
      }
    }

    return '';
  }

  activateColumnEdit(rowIndex: number, col: string, action: CellContent, currentValue: string): void {
    this.editingCell = { rowIndex, col, action };
    this.editingValue = currentValue;
    this.validationError = '';
  }

  cancelEdit(): void {
    this.editingCell = null;
    this.editingValue = '';
    this.validationError = '';
    this.saving = false;
  }

  confirmEdit(): void {
    if (!this.editingCell) return;

    const error = this.validateValue(this.editingValue, this.editingCell.col);
    if (error) {
      this.validationError = error;
      return;
    }

    const action = this.editingCell.action;
    const idParam = action.parameters?.find(p => p.parameterName === 'Id');

    if (!idParam?.parameterValue) {
      this.validationError = 'Product ID not found';
      return;
    }

    const productVariationId = Number(idParam.parameterValue);
    let numericValue = parseFloat(this.editingValue);
    const columnName = this.editingCell.col.toLowerCase();

    const isPrice = columnName.includes('price') || columnName.includes('preço') || columnName.includes('precio');
    const isStock = columnName.includes('stock') || columnName.includes('estoque');

    // For price, format with 2 decimals
    if (isPrice) {
      numericValue = parseFloat(numericValue.toFixed(2));
    }

    this.saving = true;
    this.validationError = '';

    let observable;
    let displayValue: string | number;

    if (isPrice) {
      // observable = this.#productVariationService.updateProductVariationPriceOrStock(
      //   productVariationId,
      //   numericValue,
      //   undefined
      // );
      displayValue = numericValue.toFixed(2);
    } else if (isStock) {
      // observable = this.#productVariationService.updateProductVariationPriceOrStock(
      //   productVariationId,
      //   undefined,
      //   numericValue
      // );
      displayValue = Math.floor(numericValue);
    } else {
      this.validationError = 'Column not recognized for editing';
      this.saving = false;
      return;
    }

    // observable.subscribe({
    //   next: (response) => {
    //     console.log('Update successful:', response);
    //     if (this.editingCell) {
    //       this.tableData[this.editingCell.rowIndex][this.editingCell.col] = displayValue;
    //     }
    //     this.cancelEdit();
    //   },
    //   error: (err) => {
    //     console.error('Error updating:', err);
    //     this.validationError = 'Error saving. Please try again.';
    //     this.saving = false;
    //   }
    // });
  }

  isCellInEdit(rowIndex: number, col: string): boolean {
    return this.editingCell?.rowIndex === rowIndex && this.editingCell?.col === col;
  }

  getEditColumnAction(contents: CellContent[]): CellContent | null {
    if (!contents || contents.length === 0) return null;
    return contents.find(c => c.action === 'editColumn') || null;
  }

  hasEditColumnAction(contents: CellContent[]): boolean {
    return !!this.getEditColumnAction(contents);
  }

  // Sorting methods
  sortBy(column: string): void {
    if (this.imageColumns.includes(column)) return;

    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.tableData.sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];

      let comparison = 0;
      if (aVal < bVal) comparison = -1;
      if (aVal > bVal) comparison = 1;

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  // Pagination helpers
  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.rows);
  }

  get paginationArray(): number[] {
    const pages = [];
    const total = this.totalPages;
    const current = this.page;

    if (total <= 5) {
      for (let i = 0; i < total; i++) pages.push(i);
    } else {
      pages.push(0);
      if (current > 3) pages.push(-1);

      const start = Math.max(1, current - 1);
      const end = Math.min(total - 2, current + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (current < total - 4) pages.push(-1);
      pages.push(total - 1);
    }

    return pages;
  }

  // Helper for template
  Math = Math;

  get showingFrom(): number {
    return (this.page * this.rows) + 1;
  }

  get showingTo(): number {
    return Math.min((this.page + 1) * this.rows, this.totalRecords);
  }

  getSeverityClasses(severity: string): string {
    const severityMap: Record<string, string> = {
      'primary': 'bg-blue-500 hover:bg-blue-600 text-white',
      'secondary': 'bg-gray-500 hover:bg-gray-600 text-white',
      'success': 'bg-green-500 hover:bg-green-600 text-white',
      'info': 'bg-cyan-500 hover:bg-cyan-600 text-white',
      'warn': 'bg-yellow-500 hover:bg-yellow-600 text-white',
      'help': 'bg-purple-500 hover:bg-purple-600 text-white',
      'danger': 'bg-red-500 hover:bg-red-600 text-white'
    };
    return severityMap[severity] || severityMap['secondary'];
  }

  getMessageClasses(type: string): string {
    const messageMap: Record<string, string> = {
      'info': 'bg-blue-50 border-blue-200 text-blue-800',
      'success': 'bg-green-50 border-green-200 text-green-800',
      'warning': 'bg-yellow-50 border-yellow-200 text-yellow-800',
      'error': 'bg-red-50 border-red-200 text-red-800'
    };
    return messageMap[type] || messageMap['info'];
  }
}
