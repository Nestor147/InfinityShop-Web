import { Component, computed, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormHeader } from '../../../../../shared/components/form-header/form-header';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GlowToastService } from '../../../../../shared/components/glow-toast/glow-toast.service';
import { InputValidatorComponent } from '../../../../../shared/components/input-validator/input-validator.component';
import { ProductService } from '../../../services/product/product.service';
import { CategoryService } from '../../../services/category/category.service';
import { BrandService } from '../../../../catalog/brand/service/brand.service';
import { CompanyService } from '../../../../core/company/service/company.service';
import { ProductInterface } from '../interface/product-ionterface';
import { ComboBox } from '../../../../../shared/combo-box';
import { LangService } from '../../../../../shared/services/lang/language.service';
import { PRODUCT_FORM_TEXTS, ProductFormTexts } from './forms-product.i18n';

@Component({
  selector: 'app-forms-product',
  imports: [FormHeader, ReactiveFormsModule, CommonModule, InputValidatorComponent],
  templateUrl: './forms-product.html',
  styleUrl: './forms-product.scss',
})
export class FormsProduct implements OnInit {
  @Input() productId: string | null = null;
  @Output() goBack = new EventEmitter<void>();

  #fb = inject(FormBuilder);
  #productService = inject(ProductService);
  #categoryService = inject(CategoryService);
  #brandService = inject(BrandService);
  #companyService = inject(CompanyService);
  #toastService = inject(GlowToastService);
  #langService = inject(LangService);

  productForm!: FormGroup;
  isEditMode = false;
  categories: ComboBox[] = [];
  brands: ComboBox[] = [];
  companies: ComboBox[] = [];

  /** Computed de los textos traducidos del componente */
  readonly t = computed<ProductFormTexts>(() => PRODUCT_FORM_TEXTS[this.#langService.lang()]);

  /** Mensajes de error traducidos dinámicamente */
  errorMessages = computed(() => ({
    required: this.t().required,
    minlength: this.t().minlength,
    maxlength: this.t().maxlength,
    email: this.t().email,
    pattern: this.t().pattern
  }));

  ngOnInit(): void {
    this.isEditMode = !!this.productId;
    this.#initForm();
    this.#loadCategories();
    this.#loadBrands();
    this.#loadCompanies();

    if (this.productId) {
      console.log('Modo edición - ID de producto:', this.productId);
      this.#loadProductData(this.productId);
    } else {
      console.log('Modo creación - Nuevo producto');
    }
  }

  #initForm(): void {
    this.productForm = this.#fb.group({
      companyId: ['', [Validators.required]],
      categoryId: ['', [Validators.required]],
      brandId: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      code: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(500)]]
    });
  }

  #loadCategories(): void {
    this.#categoryService.getComboCategories().subscribe({
      next: (response) => {
        this.categories = Array.isArray(response.data) ? response.data : [];
        console.log('Categorías cargadas:', this.categories);
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.#toastService.open(
          this.t().errorTitle,
          this.t().errorLoadCategories,
          {
            type: 'error',
            duration: 3000
          }
        );
      }
    });
  }

  #loadBrands(): void {
    this.#brandService.GetComboBrands().subscribe({
      next: (response) => {
        this.brands = Array.isArray(response.data) ? response.data : [];
        console.log('Marcas cargadas:', this.brands);
      },
      error: (error) => {
        console.error('Error al cargar marcas:', error);
        this.#toastService.open(
          this.t().errorTitle,
          this.t().errorLoadBrands,
          {
            type: 'error',
            duration: 3000
          }
        );
      }
    });
  }

  #loadCompanies(): void {
    this.#companyService.getComboCompanies().subscribe({
      next: (response) => {
        this.companies = Array.isArray(response.data) ? response.data : [];
        console.log('Compañías cargadas:', this.companies);
      },
      error: (error) => {
        console.error('Error al cargar compañías:', error);
        this.#toastService.open(
          this.t().errorTitle,
          this.t().errorLoadCompanies,
          {
            type: 'error',
            duration: 3000
          }
        );
      }
    });
  }

  #loadProductData(productId: string): void {
    this.#productService.getProductById(productId).subscribe({
      next: (response) => {
        const productData = Array.isArray(response.data) ? response.data[0] : response.data;
        console.log('Datos del producto:', productData);

        if (productData) {
          this.productForm.patchValue({
            companyId: productData.companyId,
            categoryId: productData.categoryId,
            brandId: productData.brandId,
            name: productData.name,
            code: productData.code,
            description: productData.description || ''
          });
        }
      },
      error: (error) => {
        console.error('Error al cargar datos del producto:', error);
        this.#toastService.open(
          this.t().errorTitle,
          this.t().errorLoadProduct,
          {
            type: 'error',
            duration: 3000
          }
        );
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const productData: ProductInterface = {
      ...this.productForm.value,
      ...(this.isEditMode && this.productId ? { id: this.productId } : {})
    };

    console.log('Form values:', this.productForm.value);
    console.log('Product data to send:', productData);

    if (this.isEditMode) {
      this.#updateProduct(productData);
    } else {
      this.#createProduct(productData);
    }
  }

  #createProduct(product: ProductInterface): void {
    this.#productService.insertProduct(product).subscribe({
      next: (response) => {
        this.#toastService.open(
          this.t().productCreatedTitle,
          response.messages[0].description || this.t().productCreatedSuccess,
          {
            type: response.messages[0].type ? 'success' : 'error',
            duration: 3000
          }
        );
        this.goBack.emit();
      },
      error: (error) => {
        this.#toastService.open(
          this.t().productCreatedTitle,
          error.messages[0].description || this.t().productCreatedError,
          {
            type: error.messages[0].type ? 'error' : 'success',
            duration: 3000
          }
        );
      }
    });
  }

  #updateProduct(product: ProductInterface): void {
    this.#productService.updateProduct(product).subscribe({
      next: (response) => {
        this.#toastService.open(
          this.t().productUpdatedTitle,
          response.messages[0].description || this.t().productUpdatedSuccess,
          {
            type: response.messages[0].type ? 'success' : 'error',
            duration: 3000
          }
        );
        this.goBack.emit();
      },
      error: (error) => {
        this.#toastService.open(
          this.t().productUpdatedTitle,
          error.messages[0].description || this.t().productUpdatedError,
          {
            type: error.messages[0].type ? 'error' : 'success',
            duration: 3000
          }
        );
      }
    });
  }

  onCancel(): void {
    this.goBack.emit();
  }
}
