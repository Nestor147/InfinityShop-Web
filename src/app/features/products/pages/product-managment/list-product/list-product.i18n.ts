import type { LangCode } from '../../../../../shared/i18n/lang.types';

export interface ProductListTexts {
  title: string;
  searchPlaceholder: string;
  addButtonText: string;
  allCategories: string;
  deleteTitle: string;
  deleteMessage1: string;
  deleteMessage2: string;
  expectedText: string;
  deleteSuccess: string;
  deleteError: string;
}

export const PRODUCT_LIST_TEXTS: Record<LangCode, ProductListTexts> = {
  en: {
    title: 'Product Management',
    searchPlaceholder: 'Search products...',
    addButtonText: 'Add Product',
    allCategories: 'All Categories',
    deleteTitle: 'Delete Product',
    deleteMessage1: 'This action will permanently delete the product.',
    deleteMessage2: 'To continue, type the confirmation phrase.',
    expectedText: 'DELETE',
    deleteSuccess: 'Product deleted successfully',
    deleteError: 'Error deleting product'
  },
  es: {
    title: 'Gestión de Productos',
    searchPlaceholder: 'Buscar productos...',
    addButtonText: 'Agregar Producto',
    allCategories: 'Todas las Categorías',
    deleteTitle: 'Eliminar Producto',
    deleteMessage1: 'Esta acción eliminará permanentemente el producto.',
    deleteMessage2: 'Para continuar, escribe la frase de confirmación.',
    expectedText: 'ELIMINAR',
    deleteSuccess: 'Producto eliminado correctamente',
    deleteError: 'Error al eliminar el producto'
  }
};
