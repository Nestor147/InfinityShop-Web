import type { LangCode } from '../../../../shared/i18n/lang.types';

export interface CompanyTexts {
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

export const COMPANY_TEXTS: Record<LangCode, CompanyTexts> = {
  en: {
    title: 'Company Management',
    searchPlaceholder: 'Search companies...',
    addButtonText: 'Add Company',
    deleteTitle: 'Delete Company',
    deleteMessage1: 'This action will permanently delete the company.',
    deleteMessage2: 'To continue, type the confirmation phrase.',
    expectedText: 'DELETE',
    deleteSuccess: 'Company deleted successfully',
    deleteError: 'Error deleting company'
  },
  es: {
    title: 'Gestión de Compañías',
    searchPlaceholder: 'Buscar compañías...',
    addButtonText: 'Agregar Compañía',
    deleteTitle: 'Eliminar Compañía',
    deleteMessage1: 'Esta acción eliminará permanentemente la compañía.',
    deleteMessage2: 'Para continuar, escribe la frase de confirmación.',
    expectedText: 'ELIMINAR',
    deleteSuccess: 'Compañía eliminada correctamente',
    deleteError: 'Error al eliminar la compañía'
  }
};
