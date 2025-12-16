import type { LangCode } from '../../../../shared/i18n/lang.types';

export interface CategoryFormTexts {
  // Error messages
  required: string;
  minlength: string;
  maxlength: string;
  email: string;
  pattern: string;

  // Toast messages
  errorTitle: string;
  errorLoadCategories: string;
  errorLoadCompanies: string;
  errorLoadCategory: string;

  // Success messages
  categoryCreatedTitle: string;
  categoryCreatedSuccess: string;
  categoryCreatedError: string;
  categoryUpdatedTitle: string;
  categoryUpdatedSuccess: string;
  categoryUpdatedError: string;
}

export const CATEGORY_FORM_TEXTS: Record<LangCode, CategoryFormTexts> = {
  en: {
    // Error messages
    required: 'This field is required',
    minlength: 'Minimum length not met',
    maxlength: 'Maximum length exceeded',
    email: 'Invalid email format',
    pattern: 'Invalid format',

    // Toast messages
    errorTitle: 'Error',
    errorLoadCategories: 'Error loading parent categories',
    errorLoadCompanies: 'Error loading companies',
    errorLoadCategory: 'Error loading category data',

    // Success messages
    categoryCreatedTitle: 'Category created',
    categoryCreatedSuccess: 'Category created successfully',
    categoryCreatedError: 'Error creating category',
    categoryUpdatedTitle: 'Category updated',
    categoryUpdatedSuccess: 'Category updated successfully',
    categoryUpdatedError: 'Error updating category'
  },
  es: {
    // Error messages
    required: 'Este campo es requerido',
    minlength: 'La longitud mínima no se cumple',
    maxlength: 'La longitud máxima excedida',
    email: 'Formato de email inválido',
    pattern: 'Formato inválido',

    // Toast messages
    errorTitle: 'Error',
    errorLoadCategories: 'Error al cargar las categorías padre',
    errorLoadCompanies: 'Error al cargar las compañías',
    errorLoadCategory: 'Error al cargar los datos de la categoría',

    // Success messages
    categoryCreatedTitle: 'Categoría creada',
    categoryCreatedSuccess: 'Categoría creada correctamente',
    categoryCreatedError: 'Error al crear la categoría',
    categoryUpdatedTitle: 'Categoría actualizada',
    categoryUpdatedSuccess: 'Categoría actualizada correctamente',
    categoryUpdatedError: 'Error al actualizar la categoría'
  }
};
