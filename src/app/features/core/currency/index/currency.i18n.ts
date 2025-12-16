import type { LangCode } from '../../../../shared/i18n/lang.types';

export interface CurrencyTexts {
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

export const CURRENCY_TEXTS: Record<LangCode, CurrencyTexts> = {
  en: {
    title: 'Currency Management',
    searchPlaceholder: 'Search currencies...',
    addButtonText: 'Add Currency',
    deleteTitle: 'Delete Currency',
    deleteMessage1: 'This action will permanently delete the currency.',
    deleteMessage2: 'To continue, type the confirmation phrase.',
    expectedText: 'DELETE',
    deleteSuccess: 'Currency deleted successfully',
    deleteError: 'Error deleting currency'
  },
  es: {
    title: 'Gestión de Monedas',
    searchPlaceholder: 'Buscar monedas...',
    addButtonText: 'Agregar Moneda',
    deleteTitle: 'Eliminar Moneda',
    deleteMessage1: 'Esta acción eliminará permanentemente la moneda.',
    deleteMessage2: 'Para continuar, escribe la frase de confirmación.',
    expectedText: 'ELIMINAR',
    deleteSuccess: 'Moneda eliminada correctamente',
    deleteError: 'Error al eliminar la moneda'
  }
};
