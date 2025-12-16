import { Component, computed, inject, OnInit } from '@angular/core';
import { DialogService } from '../../../../shared/components/dialog-modal';
import { GlowToastService } from '../../../../shared/components/glow-toast/glow-toast.service';
import { CategoryService } from '../../../products/services/category/category.service';
import { TableHeaderConfig } from '../../../../shared/models/interface/table-header-config.interface';
import { TableHeader } from '../../../../shared/components/table-header/table-header';
import { MasterTable } from '../../../../shared/components/master-table/master-table';
import { MasterTableResponse } from '../../../../shared/models/interface/response-master-table.interface';
import { CommonModule } from '@angular/common';
import { FormCategoryComponent } from '../form-category/form-category';
import { AuthorizeConfirmComponent } from '../../../../shared/components/authorize-confirm/authorize-confirm.component';
import { LangService } from '../../../../shared/services/lang/language.service';
import { CATEGORY_TEXTS, CategoryTexts } from './category.i18n';

@Component({
  selector: 'app-category',
  imports: [TableHeader, MasterTable, CommonModule, FormCategoryComponent],
  templateUrl: './category.html'
})
export default class CategoryComponent implements OnInit {
  #categoryService = inject(CategoryService);
  #toastService = inject(GlowToastService);
  #dialogService = inject(DialogService);
  #langService = inject(LangService);

  mostrarFormulario = false;
  categoryIdToEdit: string | null = null;

  pageSize = 10;
  numberPage = 1;

  data!: MasterTableResponse;

  searchFilter: string = '';

  /** Computed de los textos traducidos del componente */
  readonly t = computed<CategoryTexts>(() => CATEGORY_TEXTS[this.#langService.lang()]);

  /** Configuración del header de la tabla con textos traducidos */
  categoryHeaderConfig = computed<TableHeaderConfig>(() => ({
    title: this.t().title,
    searchPlaceholder: this.t().searchPlaceholder,
    dropdownOptions: [],
    showDropdown: false,
    showSearch: true,
    showAddButton: true,
    addButtonText: this.t().addButtonText,
  }));

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories() {
    this.#categoryService.getDetailsCategory(
      this.pageSize,
      this.numberPage,
      this.searchFilter || undefined
    ).subscribe({
      next: (response) => {
        this.data = response;
        console.log('Las categorías que llegan: ', this.data);
      },
      error: (error) => {
        console.error('Error al obtener categorías:', error);
        if (error.error) {
          this.data = error.error;
        }
      }
    });
  }

  handleTableClick(event: any) {
    console.log('Lo que llega del click ', event);

    const accion = event.cellContent?.action;
    const categoryId = event.cellContent?.parameters?.[0]?.parameterValue;
    const valores = event.cellContent?.parameters;

    console.log('Lo que llega al hacer click: ', valores);

    switch (accion) {
      case 'delete':
        this.#confirmDelete(categoryId);
        break;
      case 'edit':
        this.editCategory(categoryId);
        break;
      default:
        console.warn('Acción no reconocida:', accion);
    }
  }

  #confirmDelete(categoryId: string): void {
    this.#dialogService.open(AuthorizeConfirmComponent, {
      data: {
        title: this.t().deleteTitle,
        message1: this.t().deleteMessage1,
        message2: this.t().deleteMessage2,
        expectedText: this.t().expectedText,
        type: 'error'
      }
    });

    this.#dialogService.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.#deleteCategory(categoryId);
      }
    });
  }

  #deleteCategory(categoryId: string): void {
    this.#categoryService.deleteCategoryById(categoryId).subscribe({
      next: (response) => {
        this.#toastService.open(
          this.t().deleteTitle,
          response.messages[0].description || this.t().deleteSuccess,
          {
            type: response.messages[0].type ? 'success' : 'error',
            duration: 3000
          }
        );
        this.getAllCategories();
      },
      error: (error) => {
        this.#toastService.open(
          this.t().deleteTitle,
          error.messages[0].description || this.t().deleteError,
          {
            type: error.messages[0].type ? 'error' : 'success',
            duration: 3000
          }
        );
      }
    });
  }

  handlePaginationChange({ pageNumber, pageSize }: { pageNumber: number; pageSize: number }) {
    this.numberPage = pageNumber;
    this.pageSize = pageSize;
    this.getAllCategories();
  }

  onSearchChange(searchTerm: string) {
    this.searchFilter = searchTerm;
    this.numberPage = 1;
    this.getAllCategories();
  }

  addCategory() {
    this.categoryIdToEdit = null;
    this.mostrarFormulario = true;
    console.log('Add category clicked');
  }

  editCategory(categoryId: string) {
    this.categoryIdToEdit = categoryId;
    this.mostrarFormulario = true;
    console.log('Edit category clicked with ID:', categoryId);
  }

  goToBack() {
    this.mostrarFormulario = false;
    this.categoryIdToEdit = null;
    setTimeout(() => {
      this.getAllCategories();
    }, 100);
  }
}
