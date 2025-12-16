import { Component, computed, inject, OnInit } from '@angular/core';
import { GlowToastService } from '../../../../shared/components/glow-toast/glow-toast.service';
import { CompanyService } from '../service/company.service';
import { TableHeaderConfig } from '../../../../shared/models/interface/table-header-config.interface';
import { TableHeader } from '../../../../shared/components/table-header/table-header';
import { MasterTable } from '../../../../shared/components/master-table/master-table';
import { MasterTableResponse } from '../../../../shared/models/interface/response-master-table.interface';
import { CommonModule } from '@angular/common';
import { FormCompanyComponent } from '../form-company/form-company.component';
import { DialogService } from '../../../../shared/components/dialog-modal/dialog.service';
import { AuthorizeConfirmComponent } from '../../../../shared/components/authorize-confirm/authorize-confirm.component';
import { LangService } from '../../../../shared/services/lang/language.service';
import { COMPANY_TEXTS, CompanyTexts } from './company.i18n';

@Component({
  selector: 'app-company',
  imports: [TableHeader, MasterTable, CommonModule, FormCompanyComponent],
  templateUrl: './company.html'
})
export default class CompanyComponent implements OnInit {
  #companyService = inject(CompanyService);
  #toastService = inject(GlowToastService);
  #dialogService = inject(DialogService);
  #langService = inject(LangService);

  mostrarFormulario = false;
  companyIdToEdit: string | null = null;

  pageSize = 10;
  numberPage = 1;

  data!: MasterTableResponse;

  searchFilter: string = '';

  /** Computed de los textos traducidos del componente */
  readonly t = computed<CompanyTexts>(() => COMPANY_TEXTS[this.#langService.lang()]);

  /** Configuración del header de la tabla con textos traducidos */
  companyHeaderConfig = computed<TableHeaderConfig>(() => ({
    title: this.t().title,
    searchPlaceholder: this.t().searchPlaceholder,
    dropdownOptions: [],
    showDropdown: false,
    showSearch: true,
    showAddButton: true,
    addButtonText: this.t().addButtonText,
  }));

  ngOnInit(): void {
    this.getAllCompanies();
  }

  getAllCompanies() {
    this.#companyService.getDetailsCompany(
      this.pageSize,
      this.numberPage,
      this.searchFilter || undefined
    ).subscribe({
      next: (response) => {
        this.data = response;
        console.log('Las compañías que llegan: ', this.data);
      },
      error: (error) => {
        console.error('Error al obtener compañías:', error);
        if (error.error) {
          this.data = error.error;
        }
      }
    });
  }

  handleTableClick(event: any) {
    console.log('Lo que llega del click ', event);

    const accion = event.cellContent?.action;
    const companyId = event.cellContent?.parameters?.[0]?.parameterValue;
    const valores = event.cellContent?.parameters;

    console.log('Lo que llega al hacer click: ', valores);

    switch (accion) {
      case 'delete':
        this.#confirmDelete(companyId);
        break;
      case 'edit':
        this.editCompany(companyId);
        break;
      default:
        console.warn('Acción no reconocida:', accion);
    }
  }

  #confirmDelete(companyId: string): void {
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
        this.#deleteCompany(companyId);
      }
    });
  }

  #deleteCompany(companyId: string): void {
    this.#companyService.deleteCompanyById(companyId).subscribe({
      next: (response) => {
        this.#toastService.open(
          this.t().deleteTitle,
          response.messages[0].description || this.t().deleteSuccess,
          {
            type: response.messages[0].type ? 'success' : 'error',
            duration: 3000
          }
        );
        this.getAllCompanies();
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
    this.getAllCompanies();
  }

  onSearchChange(searchTerm: string) {
    this.searchFilter = searchTerm;
    this.numberPage = 1;
    this.getAllCompanies();
  }

  addCompany() {
    this.companyIdToEdit = null;
    this.mostrarFormulario = true;
    console.log('Add company clicked');
  }

  editCompany(companyId: string) {
    this.companyIdToEdit = companyId;
    this.mostrarFormulario = true;
    console.log('Edit company clicked with ID:', companyId);
  }

  goToBack() {
    this.mostrarFormulario = false;
    this.companyIdToEdit = null;
    // Pequeño delay para asegurar que el formulario se cierre antes de recargar
    setTimeout(() => {
      this.getAllCompanies();
    }, 100);
  }
}
