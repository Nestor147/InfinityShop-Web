import type { LangCode } from '../../../../shared/i18n/lang.types';

export interface CategoryTexts {
  title: string;
  searchPlaceholder: string;
  addButtonText: string;
  deleteTitle: string;
  deleteMessage1: string;
  deleteMessage2: string;
  expectedText: string;
  deleteSuccess: string;
  deleteError: string;
}

export const CATEGORY_TEXTS: Record<LangCode, CategoryTexts> = {
  en: {
    title: 'Category Management',
    searchPlaceholder: 'Search categories...',
    addButtonText: 'Add Category',
    deleteTitle: 'Delete Category',
    deleteMessage1: 'This action will permanently delete the category.',
    deleteMessage2: 'To continue, type the confirmation phrase.',
    expectedText: 'DELETE',
    deleteSuccess: 'Category deleted successfully',
    deleteError: 'Error deleting category'
  },
  es: {
    title: 'Gestión de Categorías',
    searchPlaceholder: 'Buscar categorías...',
    addButtonText: 'Agregar Categoría',
    deleteTitle: 'Eliminar Categoría',
    deleteMessage1: 'Esta acción eliminará permanentemente la categoría.',
    deleteMessage2: 'Para continuar, escribe la frase de confirmación.',
    expectedText: 'ELIMINAR',
    deleteSuccess: 'Categoría eliminada correctamente',
    deleteError: 'Error al eliminar la categoría'
  }
};
