import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { TableHeaderConfig } from '../../../../../shared/models/interface/table-header-config.interface';
import { TableHeader } from '../../../../../shared/components/table-header/table-header';
import { DropdownOption } from '../../../../../shared/models/interface/dropdown-option.interface';
import { CategoryService } from '../../../services/category/category.service';
import { MasterTable } from '../../../../../shared/components/master-table/master-table';
import { ProductService } from '../../../services/product/product.service';
import { MasterTableResponse } from '../../../../../shared/models/interface/response-master-table.interface';
import { CommonModule } from '@angular/common';
import { FormsProduct } from "../forms-product/forms-product";
import { GlowToastService } from '../../../../../shared/components/glow-toast/glow-toast.service';

@Component({
  selector: 'app-list-product',
  imports: [TableHeader, MasterTable, CommonModule, FormsProduct],
  templateUrl: './list-product.html',
  styleUrl: './list-product.scss',
})
export default class ListProduct implements OnInit {
  #categoryService = inject(CategoryService);
  #productService = inject(ProductService);
  #toastService = inject(GlowToastService);

  mostrarFormulario = false;

  pageSize = 10;
  numberPage = 1;

  data!:  MasterTableResponse;

  searchFilter: string = '';
  selectedSubcategoryId: string | null = null;

  categories: DropdownOption[] = [];
  productHeaderConfig: TableHeaderConfig = {
    title: 'Product Management',
    searchPlaceholder: 'Search products...',
    dropdownOptions: [],
    showDropdown: true,
    showSearch: true,
    showAddButton: true,
    // showPixOption: true,
    // hasVendorQr: false,
    // qrLoading: false,
    addButtonText: 'Add Product',
    // pixButtonText: 'Configure Pix'
  };

  ngOnInit(): void {
    this.loadCategories();
  }

loadCategories() {
    this.#categoryService.getComboCategories().subscribe({
      next: (res: any) => {

        this.categories = (res?.data || []).map((category: any) => ({
          id: category.id,
          name: category.name,
          value: category.id
        }));

        const allCategoriesOption = {
          id: '0',
          name: 'All Categories',
          value: '0'
        };

        this.categories.unshift(allCategoriesOption);

        this.productHeaderConfig = {
          ...this.productHeaderConfig,
          dropdownOptions: this.categories
        };

        this.selectedSubcategoryId = '0';
      },
      error: (error: any) => {
        console.error('Error loading categories:', error);

        // Datos de prueba si hay error
        this.categories = [
          { id: '0', name: 'All Categories', value: '0' },
          { id: '1', name: 'Test Category 1', value: '1' },
          { id: '2', name: 'Test Category 2', value: '2' }
        ];

        this.productHeaderConfig = {
          ...this.productHeaderConfig,
          dropdownOptions: this.categories
        };
      }
    });
  }

  getAllProducts() {
    if (!this.selectedSubcategoryId) return;
    this.#productService.getAllProducts(
      this.selectedSubcategoryId,
      this.pageSize,
      this.numberPage,
      this.searchFilter || undefined
    ).subscribe({
      next: (response) => {
        this.data = response;
        console.log('Los productos que llega: ', this.data);
      },
      error: (error) => {
        console.error('Error al obtener productos:', error);
        if (error.error) {
          this.data = error.error;
        }
      }
    });
  }

  handleTableClick(event: any) {
    console.log('Lo que llega del click ', event);

    const accion = event.cellContent?.action;
    const productId = event.cellContent?.parameters?.[0]?.parameterValue;
    const valores = event.cellContent?.parameters;

    console.log('Lo que llega al hacer click: ', valores);

    switch (accion) {
      case 'delete':
        this.#confirmDelete(productId);
        break;
      case 'edit':
        // this.#navigateToEdit(productId);
        break;
      case 'addProductVariation':
        // this.#navigateToPerspectiva(productId);
        break;
      default:
        console.warn('Acción no reconocida:', accion);
    }
  }
  #confirmDelete(productId: string): void {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este producto?');

    if (confirmDelete) {
      this.#deleteProduct(productId);
    }
  }
  #deleteProduct(productId: string): void {
    this.#productService.deleteProductById(productId).subscribe({
      next: (response) => {
        this.#toastService.open(
          'Product delete',
          response.messages[0].description || 'Producto eliminado correctamente',
          {
            type: response.messages[0].type ? 'success' : 'error',
            duration: 3000
          }
        );
        this.getAllProducts();
      },
      error: (error) => {
        this.#toastService.open(
          'Product delete',
          error.messages[0].description || 'Producto eliminado correctamente',
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
    this.getAllProducts();
  }

  onSearchChange(searchTerm: string) {
    this.searchFilter = searchTerm;
    this.numberPage = 1;
    this.getAllProducts();
  }

  onDropdownChange(selectedValue: any) {
    this.selectedSubcategoryId = selectedValue;
    this.getAllProducts();
  }

  addProduct() {
    this.mostrarFormulario = true;
    console.log('Add product clicked');
  }

  configurePix() {
    console.log('Configure Pix clicked');
  }

  goToBack() {
    this.mostrarFormulario = false;
    this.getAllProducts();
  }
}
