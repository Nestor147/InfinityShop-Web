import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { MasterTableResponse } from '../../../../shared/models/interface/response-master-table.interface';
import { Company } from '../interface/company-interface';
import { LangService } from '../../../../shared/services/lang/language.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  #http = inject(HttpClient);
  #langService = inject(LangService);
  #baseUrl = `${environment.apiUrl}/Company`;

  getDetailsCompany(
    PageSize: number,
    PageNumber: number,
    SearchText?: string
  ): Observable<MasterTableResponse> {
    const currentLang = this.#langService.lang();

    let params = new HttpParams()
      .set('PageSize', PageSize)
      .set('PageNumber', PageNumber)
      .set('Lang', currentLang)
      .set('_t', Date.now().toString()); // Cache buster
    if (SearchText && SearchText.trim() !== '') {
      params = params.set('SearchText', SearchText);
    }
    return this.#http.get<MasterTableResponse>(`${this.#baseUrl}/GetCompaniesPaginated`, { params });
  }

  insertCompany(request: Company): Observable<any> {
    return this.#http.post<any>(
      `${this.#baseUrl}/InsertCompany`,
      request
    );
  }

  updateCompany(request: Company): Observable<any> {
    return this.#http.post<any>(
      `${this.#baseUrl}/UpdateCompany`,
      request
    );
  }

  deleteCompanyById(id: string): Observable<any> {
    return this.#http.post<any>(
      `${this.#baseUrl}/DeleteCompanyById`,
      JSON.stringify(id),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  getCompanyById(id: string): Observable<any> {
    const params = new HttpParams().set('id', id);

    return this.#http.get<any>(
      `${this.#baseUrl}/GetCompanyById`,
      { params }
    );
  }

  getComboCompanies(): Observable<any> {
    return this.#http.get<any>(`${this.#baseUrl}/GetComboCompanies`);
  }
}
