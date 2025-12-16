import { Component, computed, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormHeader } from '../../../../shared/components/form-header/form-header';
import { InputValidatorComponent } from '../../../../shared/components/input-validator/input-validator.component';
import { CurrencyService } from '../service/currency.service';
import { GlowToastService } from '../../../../shared/components/glow-toast/glow-toast.service';
import { CurrencyInterface } from '../interface/currency-interface';
import { LangService } from '../../../../shared/services/lang/language.service';
import { CURRENCY_FORM_TEXTS, CurrencyFormTexts } from './form-currency.i18n';

@Component({
  selector: 'app-form-currency',
  imports: [CommonModule, ReactiveFormsModule, FormHeader, InputValidatorComponent],
  templateUrl: './form-currency.html',
})
export class FormCurrencyComponent implements OnInit {
  @Input() currencyId: string | null = null;
  @Output() goBack = new EventEmitter<void>();

  #fb = inject(FormBuilder);
  #currencyService = inject(CurrencyService);
  #toastService = inject(GlowToastService);
  #langService = inject(LangService);

  currencyForm!: FormGroup;
  isEditMode = false;

  /** Computed de los textos traducidos del componente */
  readonly t = computed<CurrencyFormTexts>(() => CURRENCY_FORM_TEXTS[this.#langService.lang()]);

  /** Mensajes de error traducidos dinámicamente */
  errorMessages = computed(() => ({
    required: this.t().required,
    minlength: this.t().minlength,
    maxlength: this.t().maxlength,
    email: this.t().email,
    pattern: this.t().pattern
  }));

  ngOnInit(): void {
    this.isEditMode = !!this.currencyId;
    this.#initForm();

    if (this.currencyId) {
      console.log('Modo edición - ID de moneda:', this.currencyId);
      this.#loadCurrencyData(this.currencyId);
    } else {
      console.log('Modo creación - Nueva moneda');
    }
  }

  #initForm(): void {
    this.currencyForm = this.#fb.group({
      isoCode: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      symbol: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5)]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]]
    });
  }

  #loadCurrencyData(currencyId: string): void {
    this.#currencyService.getCurrencyById(currencyId).subscribe({
      next: (response) => {
        const currencyData = Array.isArray(response.data) ? response.data[0] : response.data;
        console.log('Datos de la moneda:', currencyData);

        if (currencyData) {
          this.currencyForm.patchValue({
            isoCode: currencyData.isoCode,
            symbol: currencyData.symbol,
            name: currencyData.name
          });
        }
      },
      error: (error) => {
        console.error('Error al cargar datos de la moneda:', error);
        this.#toastService.open(
          this.t().errorTitle,
          this.t().errorLoadCurrency,
          {
            type: 'error',
            duration: 3000
          }
        );
      }
    });
  }

  onSubmit(): void {
    if (this.currencyForm.invalid) {
      this.currencyForm.markAllAsTouched();
      return;
    }

    const currencyData: CurrencyInterface = {
      ...this.currencyForm.value,
      ...(this.isEditMode && this.currencyId ? { id: this.currencyId } : {})
    };

    console.log('Form values:', this.currencyForm.value);
    console.log('Currency data to send:', currencyData);

    if (this.isEditMode) {
      this.#updateCurrency(currencyData);
    } else {
      this.#createCurrency(currencyData);
    }
  }

  #createCurrency(currency: CurrencyInterface): void {
    this.#currencyService.insertCurrency(currency).subscribe({
      next: (response) => {
        this.#toastService.open(
          this.t().currencyCreatedTitle,
          response.messages[0].description || this.t().currencyCreatedSuccess,
          {
            type: response.messages[0].type ? 'success' : 'error',
            duration: 3000
          }
        );
        this.goBack.emit();
      },
      error: (error) => {
        this.#toastService.open(
          this.t().currencyCreatedTitle,
          error.messages[0].description || this.t().currencyCreatedError,
          {
            type: error.messages[0].type ? 'error' : 'success',
            duration: 3000
          }
        );
      }
    });
  }

  #updateCurrency(currency: CurrencyInterface): void {
    this.#currencyService.updateCurrency(currency).subscribe({
      next: (response) => {
        this.#toastService.open(
          this.t().currencyUpdatedTitle,
          response.messages[0].description || this.t().currencyUpdatedSuccess,
          {
            type: response.messages[0].type ? 'success' : 'error',
            duration: 3000
          }
        );
        this.goBack.emit();
      },
      error: (error) => {
        this.#toastService.open(
          this.t().currencyUpdatedTitle,
          error.messages[0].description || this.t().currencyUpdatedError,
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
