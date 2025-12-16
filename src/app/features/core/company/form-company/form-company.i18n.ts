import type { LangCode } from '../../../../shared/i18n/lang.types';

export interface CompanyFormTexts {
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
  companyInfoTitle: string;
  companyNameLabel: string;
  companyNamePlaceholder: string;
  taxLabel: string;
  taxSelectPlaceholder: string;
  taxHelpTooltip: string;
  countryCodeLabel: string;
  countryCodePlaceholder: string;

  // Buttons
  cancelButton: string;
  updateButton: string;
  saveButton: string;

  // Toast messages
  errorTitle: string;
  errorLoadTaxes: string;
  errorLoadCompany: string;

  // Success messages
  companyCreatedTitle: string;
  companyCreatedSuccess: string;
  companyCreatedError: string;
  companyUpdatedTitle: string;
  companyUpdatedSuccess: string;
  companyUpdatedError: string;
}

export const COMPANY_FORM_TEXTS: Record<LangCode, CompanyFormTexts> = {
  en: {
    // Error messages
    required: 'This field is required',
    minlength: 'Minimum length not met',
    maxlength: 'Maximum length exceeded',
    email: 'Invalid email format',
    pattern: 'Invalid format',

    // Form headers
    editTitle: 'Edit Company',
    newTitle: 'New Company',
    editSubtitle: 'Update the company information',
    newSubtitle: 'Complete the information to add a new company',

    // Labels and placeholders
    companyInfoTitle: 'Company Information',
    companyNameLabel: 'Company Name',
    companyNamePlaceholder: 'Enter company name',
    taxLabel: 'Tax',
    taxSelectPlaceholder: 'Select a tax',
    taxHelpTooltip: 'Select the tax identification for the company',
    countryCodeLabel: 'Country Code',
    countryCodePlaceholder: 'Enter country code (e.g., US, MX)',

    // Buttons
    cancelButton: 'Cancel',
    updateButton: 'Update',
    saveButton: 'Save',

    // Toast messages
    errorTitle: 'Error',
    errorLoadTaxes: 'Error loading taxes',
    errorLoadCompany: 'Error loading company data',

    // Success messages
    companyCreatedTitle: 'Company created',
    companyCreatedSuccess: 'Company created successfully',
    companyCreatedError: 'Error creating company',
    companyUpdatedTitle: 'Company updated',
    companyUpdatedSuccess: 'Company updated successfully',
    companyUpdatedError: 'Error updating company'
  },
  es: {
    // Error messages
    required: 'Este campo es requerido',
    minlength: 'La longitud mínima no se cumple',
    maxlength: 'La longitud máxima excedida',
    email: 'Formato de email inválido',
    pattern: 'Formato inválido',

    // Form headers
    editTitle: 'Editar Compañía',
    newTitle: 'Nueva Compañía',
    editSubtitle: 'Actualizar la información de la compañía',
    newSubtitle: 'Complete la información para agregar una nueva compañía',

    // Labels and placeholders
    companyInfoTitle: 'Información de la Compañía',
    companyNameLabel: 'Nombre de la Compañía',
    companyNamePlaceholder: 'Ingrese el nombre de la compañía',
    taxLabel: 'Impuesto',
    taxSelectPlaceholder: 'Seleccione un impuesto',
    taxHelpTooltip: 'Seleccione la identificación fiscal de la compañía',
    countryCodeLabel: 'Código de País',
    countryCodePlaceholder: 'Ingrese el código de país (ej., US, MX)',

    // Buttons
    cancelButton: 'Cancelar',
    updateButton: 'Actualizar',
    saveButton: 'Guardar',

    // Toast messages
    errorTitle: 'Error',
    errorLoadTaxes: 'Error al cargar los impuestos',
    errorLoadCompany: 'Error al cargar los datos de la compañía',

    // Success messages
    companyCreatedTitle: 'Compañía creada',
    companyCreatedSuccess: 'Compañía creada correctamente',
    companyCreatedError: 'Error al crear la compañía',
    companyUpdatedTitle: 'Compañía actualizada',
    companyUpdatedSuccess: 'Compañía actualizada correctamente',
    companyUpdatedError: 'Error al actualizar la compañía'
  }
};
