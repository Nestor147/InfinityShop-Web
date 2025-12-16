import type { LangCode } from '../../../../shared/i18n/lang.types';

export interface CurrencyFormTexts {
  // Error messages
  required: string;
  minlength: string;
  maxlength: string;
  email: string;
  pattern: string;

  // Form headers
  editTitle: string;
  newTitle: string;
  editSubtitle: string;
  newSubtitle: string;

  // Labels and placeholders
  currencyInfoTitle: string;
  isoCodeLabel: string;
  isoCodePlaceholder: string;
  isoCodeHelpTooltip: string;
  symbolLabel: string;
  symbolPlaceholder: string;
  symbolHelpTooltip: string;
  currencyNameLabel: string;
  currencyNamePlaceholder: string;

  // Buttons
  cancelButton: string;
  updateButton: string;
  saveButton: string;

  // Toast messages
  errorTitle: string;
  errorLoadCurrency: string;

  // Success messages
  currencyCreatedTitle: string;
  currencyCreatedSuccess: string;
  currencyCreatedError: string;
  currencyUpdatedTitle: string;
  currencyUpdatedSuccess: string;
  currencyUpdatedError: string;
}

export const CURRENCY_FORM_TEXTS: Record<LangCode, CurrencyFormTexts> = {
  en: {
    // Error messages
    required: 'This field is required',
    minlength: 'Minimum length not met',
    maxlength: 'Maximum length exceeded',
    email: 'Invalid email format',
    pattern: 'Invalid format',

    // Form headers
    editTitle: 'Edit Currency',
    newTitle: 'New Currency',
    editSubtitle: 'Update the currency information',
    newSubtitle: 'Complete the information to add a new currency',

    // Labels and placeholders
    currencyInfoTitle: 'Currency Information',
    isoCodeLabel: 'ISO Code',
    isoCodePlaceholder: 'Enter ISO code (e.g., USD, EUR)',
    isoCodeHelpTooltip: 'Three-letter currency code (ISO 4217)',
    symbolLabel: 'Symbol',
    symbolPlaceholder: 'Enter symbol (e.g., $, €)',
    symbolHelpTooltip: 'Currency symbol',
    currencyNameLabel: 'Currency Name',
    currencyNamePlaceholder: 'Enter currency name (e.g., US Dollar)',

    // Buttons
    cancelButton: 'Cancel',
    updateButton: 'Update',
    saveButton: 'Save',

    // Toast messages
    errorTitle: 'Error',
    errorLoadCurrency: 'Error loading currency data',

    // Success messages
    currencyCreatedTitle: 'Currency created',
    currencyCreatedSuccess: 'Currency created successfully',
    currencyCreatedError: 'Error creating currency',
    currencyUpdatedTitle: 'Currency updated',
    currencyUpdatedSuccess: 'Currency updated successfully',
    currencyUpdatedError: 'Error updating currency'
  },
  es: {
    // Error messages
    required: 'Este campo es requerido',
    minlength: 'La longitud mínima no se cumple',
    maxlength: 'La longitud máxima excedida',
    email: 'Formato de email inválido',
    pattern: 'Formato inválido',

    // Form headers
    editTitle: 'Editar Moneda',
    newTitle: 'Nueva Moneda',
    editSubtitle: 'Actualizar la información de la moneda',
    newSubtitle: 'Complete la información para agregar una nueva moneda',

    // Labels and placeholders
    currencyInfoTitle: 'Información de la Moneda',
    isoCodeLabel: 'Código ISO',
    isoCodePlaceholder: 'Ingrese código ISO (ej., USD, EUR)',
    isoCodeHelpTooltip: 'Código de moneda de tres letras (ISO 4217)',
    symbolLabel: 'Símbolo',
    symbolPlaceholder: 'Ingrese símbolo (ej., $, €)',
    symbolHelpTooltip: 'Símbolo de la moneda',
    currencyNameLabel: 'Nombre de la Moneda',
    currencyNamePlaceholder: 'Ingrese nombre de la moneda (ej., Dólar Estadounidense)',

    // Buttons
    cancelButton: 'Cancelar',
    updateButton: 'Actualizar',
    saveButton: 'Guardar',

    // Toast messages
    errorTitle: 'Error',
    errorLoadCurrency: 'Error al cargar los datos de la moneda',

    // Success messages
    currencyCreatedTitle: 'Moneda creada',
    currencyCreatedSuccess: 'Moneda creada correctamente',
    currencyCreatedError: 'Error al crear la moneda',
    currencyUpdatedTitle: 'Moneda actualizada',
    currencyUpdatedSuccess: 'Moneda actualizada correctamente',
    currencyUpdatedError: 'Error al actualizar la moneda'
  }
};
