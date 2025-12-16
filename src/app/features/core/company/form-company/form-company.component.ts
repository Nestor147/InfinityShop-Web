import { Component, computed, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormHeader } from '../../../../shared/components/form-header/form-header';
import { InputValidatorComponent } from '../../../../shared/components/input-validator/input-validator.component';
import { CompanyService } from '../service/company.service';
import { TaxService } from '../../../tax-billing/service/tax.service';
import { GlowToastService } from '../../../../shared/components/glow-toast/glow-toast.service';
import { ComboBox } from '../../../../shared/combo-box';
import { Company } from '../interface/company-interface';
import { LangService } from '../../../../shared/services/lang/language.service';
import { COMPANY_FORM_TEXTS, CompanyFormTexts } from './form-company.i18n';

@Component({
  selector: 'app-form-company',
  imports: [CommonModule, ReactiveFormsModule, FormHeader, InputValidatorComponent],
  templateUrl: './form-company.component.html',
  styleUrl: './form-company.component.scss'
})
export class FormCompanyComponent implements OnInit {
  @Input() companyId: string | null = null;
  @Output() goBack = new EventEmitter<void>();

  #fb = inject(FormBuilder);
  #companyService = inject(CompanyService);
  #taxService = inject(TaxService);
  #toastService = inject(GlowToastService);
  #langService = inject(LangService);

  companyForm!: FormGroup;
  taxes: ComboBox[] = [];
  isEditMode = false;

  /** Computed de los textos traducidos del componente */
  readonly t = computed<CompanyFormTexts>(() => COMPANY_FORM_TEXTS[this.#langService.lang()]);

  /** Mensajes de error traducidos dinámicamente */
  errorMessages = computed(() => ({
    required: this.t().required,
    minlength: this.t().minlength,
    maxlength: this.t().maxlength,
    email: this.t().email,
    pattern: this.t().pattern
  }));

  ngOnInit(): void {
    this.isEditMode = !!this.companyId;
    this.#initForm();
    this.#loadTaxes();

    if (this.companyId) {
      console.log('Modo edición - ID de compañía:', this.companyId);
      this.#loadCompanyData(this.companyId);
    } else {
      console.log('Modo creación - Nueva compañía');
    }
  }

  #initForm(): void {
    this.companyForm = this.#fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      taxId: ['', [Validators.required]],
      countryCode: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(3)]]
    });
  }

  #loadTaxes(): void {
    this.#taxService.getComboTaxes().subscribe({
      next: (response) => {
        this.taxes = Array.isArray(response.data) ? response.data : [];
        console.log('Taxes cargados:', this.taxes);
      },
      error: (error) => {
        console.error('Error al cargar taxes:', error);
        this.#toastService.open(
          this.t().errorTitle,
          this.t().errorLoadTaxes,
          {
            type: 'error',
            duration: 3000
          }
        );
      }
    });
  }

  #loadCompanyData(companyId: string): void {
    this.#companyService.getCompanyById(companyId).subscribe({
      next: (response) => {
        // El API devuelve data como un array, tomamos el primer elemento
        const companyData = Array.isArray(response.data) ? response.data[0] : response.data;
        console.log('Datos de la compañía:', companyData);

        if (companyData) {
          this.companyForm.patchValue({
            name: companyData.name,
            taxId: companyData.taxId,
            countryCode: companyData.countryCode
          });
        }
      },
      error: (error) => {
        console.error('Error al cargar datos de la compañía:', error);
        this.#toastService.open(
          this.t().errorTitle,
          this.t().errorLoadCompany,
          {
            type: 'error',
            duration: 3000
          }
        );
      }
    });
  }

  onSubmit(): void {
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      return;
    }

    const companyData: Company = {
      ...this.companyForm.value,
      ...(this.isEditMode && this.companyId ? { id: this.companyId } : {})
    };

    console.log('Form values:', this.companyForm.value);
    console.log('Company data to send:', companyData);
    console.log('TaxId type:', typeof companyData.taxId, 'Value:', companyData.taxId);

    if (this.isEditMode) {
      this.#updateCompany(companyData);
    } else {
      this.#createCompany(companyData);
    }
  }

  #createCompany(company: Company): void {
    this.#companyService.insertCompany(company).subscribe({
      next: (response) => {
        this.#toastService.open(
          this.t().companyCreatedTitle,
          response.messages[0].description || this.t().companyCreatedSuccess,
          {
            type: response.messages[0].type ? 'success' : 'error',
            duration: 3000
          }
        );
        this.goBack.emit();
      },
      error: (error) => {
        this.#toastService.open(
          this.t().companyCreatedTitle,
          error.messages[0].description || this.t().companyCreatedError,
          {
            type: error.messages[0].type ? 'error' : 'success',
            duration: 3000
          }
        );
      }
    });
  }

  #updateCompany(company: Company): void {
    this.#companyService.updateCompany(company).subscribe({
      next: (response) => {
        this.#toastService.open(
          this.t().companyUpdatedTitle,
          response.messages[0].description || this.t().companyUpdatedSuccess,
          {
            type: response.messages[0].type ? 'success' : 'error',
            duration: 3000
          }
        );
        this.goBack.emit();
      },
      error: (error) => {
        this.#toastService.open(
          this.t().companyUpdatedTitle,
          error.messages[0].description || this.t().companyUpdatedError,
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
