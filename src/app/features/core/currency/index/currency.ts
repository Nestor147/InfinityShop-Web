import { Component, computed, inject, OnInit } from '@angular/core';
import { DialogService } from '../../../../shared/components/dialog-modal';
import { GlowToastService } from '../../../../shared/components/glow-toast/glow-toast.service';
import { CurrencyService } from '../service/currency.service';
import { TableHeaderConfig } from '../../../../shared/models/interface/table-header-config.interface';
import { TableHeader } from '../../../../shared/components/table-header/table-header';
import { MasterTable } from '../../../../shared/components/master-table/master-table';
import { MasterTableResponse } from '../../../../shared/models/interface/response-master-table.interface';
import { CommonModule } from '@angular/common';
import { FormCurrencyComponent } from '../form-currency/form-currency';
import { AuthorizeConfirmComponent } from '../../../../shared/components/authorize-confirm/authorize-confirm.component';
import { LangService } from '../../../../shared/services/lang/language.service';
import { CURRENCY_TEXTS, CurrencyTexts } from './currency.i18n';

@Component({
  selector: 'app-currency',
  imports: [TableHeader, MasterTable, CommonModule, FormCurrencyComponent],
  templateUrl: './currency.html',
})
export default class CurrencyComponent implements OnInit {
  #currencyService = inject(CurrencyService);
  #toastService = inject(GlowToastService);
  #dialogService = inject(DialogService);
  #langService = inject(LangService);

  mostrarFormulario = false;
  currencyIdToEdit: string | null = null;

  pageSize = 10;
  numberPage = 1;

  data!: MasterTableResponse;

  searchFilter: string = '';

  /** Computed de los textos traducidos del componente */
  readonly t = computed<CurrencyTexts>(() => CURRENCY_TEXTS[this.#langService.lang()]);

  /** Configuración del header de la tabla con textos traducidos */
  currencyHeaderConfig = computed<TableHeaderConfig>(() => ({
    title: this.t().title,
    searchPlaceholder: this.t().searchPlaceholder,
    dropdownOptions: [],
    showDropdown: false,
    showSearch: true,
    showAddButton: true,
    addButtonText: this.t().addButtonText,
  }));

  ngOnInit(): void {
    this.getAllCurrencies();
  }

  getAllCurrencies() {
    this.#currencyService.getDetailsCurrency(
      this.pageSize,
      this.numberPage,
      this.searchFilter || undefined
    ).subscribe({
      next: (response) => {
        this.data = response;
        console.log('Las monedas que llegan: ', this.data);
      },
      error: (error) => {
        console.error('Error al obtener monedas:', error);
        if (error.error) {
          this.data = error.error;
        }
      }
    });
  }

  handleTableClick(event: any) {
    console.log('Lo que llega del click ', event);

    const accion = event.cellContent?.action;
    const currencyId = event.cellContent?.parameters?.[0]?.parameterValue;
    const valores = event.cellContent?.parameters;

    console.log('Lo que llega al hacer click: ', valores);

    switch (accion) {
      case 'delete':
        this.#confirmDelete(currencyId);
        break;
      case 'edit':
        this.editCurrency(currencyId);
        break;
      default:
        console.warn('Acción no reconocida:', accion);
    }
  }

  #confirmDelete(currencyId: string): void {
    this.#dialogService.open(AuthorizeConfirmComponent, {
      data: {
        title: this.t().deleteTitle,
        message1: this.t().deleteMessage1,
        message2: this.t().deleteMessage2,
        expectedText: this.t().expectedText,
        type: 'error'
      }
    });

    this.#dialogService.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.#deleteCurrency(currencyId);
      }
    });
  }

  #deleteCurrency(currencyId: string): void {
    this.#currencyService.deleteCurrencyById(currencyId).subscribe({
      next: (response) => {
        this.#toastService.open(
          this.t().deleteTitle,
          response.messages[0].description || this.t().deleteSuccess,
          {
            type: response.messages[0].type ? 'success' : 'error',
            duration: 3000
          }
        );
        this.getAllCurrencies();
      },
      error: (error) => {
        this.#toastService.open(
          this.t().deleteTitle,
          error.messages[0].description || this.t().deleteError,
          {
            type: error.messages[0].type ? 'error' : 'success',
            duration: 3000
          }
        );
      }
    });
  }

  handlePaginationChange({ pageNumber, pageSize }: { pageNumber: number; pageSize: number }) {
    this.numberPage = pageNumber;
    this.pageSize = pageSize;
    this.getAllCurrencies();
  }

  onSearchChange(searchTerm: string) {
    this.searchFilter = searchTerm;
    this.numberPage = 1;
    this.getAllCurrencies();
  }

  addCurrency() {
    this.currencyIdToEdit = null;
    this.mostrarFormulario = true;
    console.log('Add currency clicked');
  }

  editCurrency(currencyId: string) {
    this.currencyIdToEdit = currencyId;
    this.mostrarFormulario = true;
    console.log('Edit currency clicked with ID:', currencyId);
  }

  goToBack() {
    this.mostrarFormulario = false;
    this.currencyIdToEdit = null;
    setTimeout(() => {
      this.getAllCurrencies();
    }, 100);
  }
}
