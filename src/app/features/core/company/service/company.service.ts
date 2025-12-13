import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { MasterTableResponse } from '../../../../shared/models/interface/response-master-table.interface';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  #http = inject(HttpClient);
  #baseUrl = `${environment.apiUrl}/Company`;

  getDetailsCompany(
    PageSize: number,
    PageNumber: number,
    SearchText?: string
  ): Observable<MasterTableResponse> {
    let params = new HttpParams()
      .set('PageSize', PageSize)
      .set('PageNumber', PageNumber);
    if (SearchText && SearchText.trim() !== '') {
      params = params.set('SearchText', SearchText);
    }
    return this.#http.get<MasterTableResponse>(`${this.#baseUrl}/GetCompaniesPaginated`, { params });
  }
}
