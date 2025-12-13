import { Component, inject, OnInit } from '@angular/core';
import { GlowToastService } from '../../../../shared/components/glow-toast/glow-toast.service';
import { CompanyService } from '../service/company.service';
import { TableHeaderConfig } from '../../../../shared/models/interface/table-header-config.interface';
import { TableHeader } from '../../../../shared/components/table-header/table-header';
import { MasterTable } from '../../../../shared/components/master-table/master-table';
import { MasterTableResponse } from '../../../../shared/models/interface/response-master-table.interface';
import { CommonModule } from '@angular/common';
import { FormCompanyComponent } from '../form-company/form-company.component';

@Component({
  selector: 'app-company',
  imports: [TableHeader, MasterTable, CommonModule, FormCompanyComponent],
  templateUrl: './company.component.html'
})
export default class CompanyComponent implements OnInit {
  #companyService = inject(CompanyService);
  #toastService = inject(GlowToastService);

  mostrarFormulario = false;

  pageSize = 10;
  numberPage = 1;

  data!: MasterTableResponse;

  searchFilter: string = '';

  companyHeaderConfig: TableHeaderConfig = {
    title: 'Company Management',
    searchPlaceholder: 'Search companies...',
    dropdownOptions: [],
    showDropdown: false,
    showSearch: true,
    showAddButton: true,
    addButtonText: 'Add Company',
  };

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
        // this.#navigateToEdit(companyId);
        break;
      default:
        console.warn('Acción no reconocida:', accion);
    }
  }

  #confirmDelete(companyId: string): void {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta compañía?');

    if (confirmDelete) {
      this.#deleteCompany(companyId);
    }
  }

  #deleteCompany(companyId: string): void {
    // Implementar cuando exista el método en el servicio
    console.log('Eliminar compañía con ID:', companyId);
    this.#toastService.open(
      'Company delete',
      'Funcionalidad de eliminación pendiente de implementar',
      {
        type: 'error',
        duration: 3000
      }
    );
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
    this.mostrarFormulario = true;
    console.log('Add company clicked');
  }

  goToBack() {
    this.mostrarFormulario = false;
    this.getAllCompanies();
  }
}
