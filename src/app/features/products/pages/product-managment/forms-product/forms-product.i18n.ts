import type { LangCode } from '../../../../../shared/i18n/lang.types';

export interface ProductFormTexts {
  // Error messages
  required: string;
  minlength: string;
  maxlength: string;
  email: string;
  pattern: string;

  // Toast messages
  errorTitle: string;
  errorLoadCategories: string;
  errorLoadBrands: string;
  errorLoadCompanies: string;
  errorLoadProduct: string;

  // Success messages
  productCreatedTitle: string;
  productCreatedSuccess: string;
  productCreatedError: string;
  productUpdatedTitle: string;
  productUpdatedSuccess: string;
  productUpdatedError: string;
}

export const PRODUCT_FORM_TEXTS: Record<LangCode, ProductFormTexts> = {
  en: {
    // Error messages
    required: 'This field is required',
    minlength: 'Minimum length not met',
    maxlength: 'Maximum length exceeded',
    email: 'Invalid email format',
    pattern: 'Invalid format',

    // Toast messages
    errorTitle: 'Error',
    errorLoadCategories: 'Error loading categories',
    errorLoadBrands: 'Error loading brands',
    errorLoadCompanies: 'Error loading companies',
    errorLoadProduct: 'Error loading product data',

    // Success messages
    productCreatedTitle: 'Product created',
    productCreatedSuccess: 'Product created successfully',
    productCreatedError: 'Error creating product',
    productUpdatedTitle: 'Product updated',
    productUpdatedSuccess: 'Product updated successfully',
    productUpdatedError: 'Error updating product'
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
    errorLoadCategories: 'Error al cargar las categorías',
    errorLoadBrands: 'Error al cargar las marcas',
    errorLoadCompanies: 'Error al cargar las compañías',
    errorLoadProduct: 'Error al cargar los datos del producto',

    // Success messages
    productCreatedTitle: 'Producto creado',
    productCreatedSuccess: 'Producto creado correctamente',
    productCreatedError: 'Error al crear el producto',
    productUpdatedTitle: 'Producto actualizado',
    productUpdatedSuccess: 'Producto actualizado correctamente',
    productUpdatedError: 'Error al actualizar el producto'
  }
};
