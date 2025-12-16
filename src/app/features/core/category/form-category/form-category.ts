import { Component, computed, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormHeader } from '../../../../shared/components/form-header/form-header';
import { InputValidatorComponent } from '../../../../shared/components/input-validator/input-validator.component';
import { CategoryService } from '../../../products/services/category/category.service';
import { GlowToastService } from '../../../../shared/components/glow-toast/glow-toast.service';
import { CategoryInterface } from '../interface/category.interface';
import { ComboBox } from '../../../../shared/combo-box';
import { CompanyService } from '../../company/service/company.service';
import { LangService } from '../../../../shared/services/lang/language.service';
import { CATEGORY_FORM_TEXTS, CategoryFormTexts } from './form-category.i18n';

@Component({
  selector: 'app-form-category',
  imports: [CommonModule, ReactiveFormsModule, FormHeader, InputValidatorComponent],
  templateUrl: './form-category.html'
})
export class FormCategoryComponent implements OnInit {
  @Input() categoryId: string | null = null;
  @Output() goBack = new EventEmitter<void>();

  #fb = inject(FormBuilder);
  #categoryService = inject(CategoryService);
  #companyService = inject(CompanyService);
  #toastService = inject(GlowToastService);
  #langService = inject(LangService);

  categoryForm!: FormGroup;
  isEditMode = false;
  categories: ComboBox[] = [];
  companies: ComboBox[] = [];

  /** Computed de los textos traducidos del componente */
  readonly t = computed<CategoryFormTexts>(() => CATEGORY_FORM_TEXTS[this.#langService.lang()]);

  /** Mensajes de error traducidos dinámicamente */
  errorMessages = computed(() => ({
    required: this.t().required,
    minlength: this.t().minlength,
    maxlength: this.t().maxlength,
    email: this.t().email,
    pattern: this.t().pattern
  }));

  ngOnInit(): void {
    this.isEditMode = !!this.categoryId;
    this.#initForm();
    this.#loadCategories();
    this.#loadCompanies();

    if (this.categoryId) {
      console.log('Modo edición - ID de categoría:', this.categoryId);
      this.#loadCategoryData(this.categoryId);
    } else {
      console.log('Modo creación - Nueva categoría');
    }
  }

  #initForm(): void {
    this.categoryForm = this.#fb.group({
      companyId: ['', [Validators.required]],
      parentId: [''],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      code: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]]
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

  #loadCategoryData(categoryId: string): void {
    this.#categoryService.getCategoryById(categoryId).subscribe({
      next: (response) => {
        const categoryData = Array.isArray(response.data) ? response.data[0] : response.data;
        console.log('Datos de la categoría:', categoryData);

        if (categoryData) {
          this.categoryForm.patchValue({
            companyId: categoryData.companyId,
            parentId: categoryData.parentId || '',
            name: categoryData.name,
            code: categoryData.code
          });
        }
      },
      error: (error) => {
        console.error('Error al cargar datos de la categoría:', error);
        this.#toastService.open(
          this.t().errorTitle,
          this.t().errorLoadCategory,
          {
            type: 'error',
            duration: 3000
          }
        );
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const categoryData: CategoryInterface = {
      ...this.categoryForm.value,
      ...(this.isEditMode && this.categoryId ? { id: this.categoryId } : {}),
      parentId: this.categoryForm.value.parentId || null
    };

    console.log('Form values:', this.categoryForm.value);
    console.log('Category data to send:', categoryData);

    if (this.isEditMode) {
      this.#updateCategory(categoryData);
    } else {
      this.#createCategory(categoryData);
    }
  }

  #createCategory(category: CategoryInterface): void {
    this.#categoryService.insertCategory(category).subscribe({
      next: (response) => {
        this.#toastService.open(
          this.t().categoryCreatedTitle,
          response.messages[0].description || this.t().categoryCreatedSuccess,
          {
            type: response.messages[0].type ? 'success' : 'error',
            duration: 3000
          }
        );
        this.goBack.emit();
      },
      error: (error) => {
        this.#toastService.open(
          this.t().categoryCreatedTitle,
          error.messages[0].description || this.t().categoryCreatedError,
          {
            type: error.messages[0].type ? 'error' : 'success',
            duration: 3000
          }
        );
      }
    });
  }

  #updateCategory(category: CategoryInterface): void {
    this.#categoryService.updateCategory(category).subscribe({
      next: (response) => {
        this.#toastService.open(
          this.t().categoryUpdatedTitle,
          response.messages[0].description || this.t().categoryUpdatedSuccess,
          {
            type: response.messages[0].type ? 'success' : 'error',
            duration: 3000
          }
        );
        this.goBack.emit();
      },
      error: (error) => {
        this.#toastService.open(
          this.t().categoryUpdatedTitle,
          error.messages[0].description || this.t().categoryUpdatedError,
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
