import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { MasterTableResponse } from '../../../../shared/models/interface/response-master-table.interface';
import { CurrencyInterface } from '../interface/currency-interface';
import { LangService } from '../../../../shared/services/lang/language.service';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  #http = inject(HttpClient);
  #langService = inject(LangService);
  #baseUrl = `${environment.apiUrl}/Currency`;

    getDetailsCurrency(
    PageSize: number,
    PageNumber: number,
    SearchText?: string
  ): Observable<MasterTableResponse> {
    const currentLang = this.#langService.lang();

    let params = new HttpParams()
      .set('PageSize', PageSize)
      .set('PageNumber', PageNumber)
      .set('Lang', currentLang)
      .set('_t', Date.now().toString());
    if (SearchText && SearchText.trim() !== '') {
      params = params.set('SearchText', SearchText);
    }
    return this.#http.get<MasterTableResponse>(`${this.#baseUrl}/GetCurrenciesPaginated`, { params });
  }

  insertCurrency(request: CurrencyInterface): Observable<any> {
    return this.#http.post<any>(
      `${this.#baseUrl}/InsertCurrency`,
      request
    );
  }

  updateCurrency(request: CurrencyInterface): Observable<any> {
    return this.#http.post<any>(
      `${this.#baseUrl}/UpdateCurrency`,
      request
    );
  }

  deleteCurrencyById(id: string): Observable<any> {
    return this.#http.post<any>(
      `${this.#baseUrl}/DeleteCurrencyById`,
      JSON.stringify(id),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  getCurrencyById(id: string): Observable<any> {
    const params = new HttpParams().set('id', id);

    return this.#http.get<any>(
      `${this.#baseUrl}/GetCurrencyById`,
      { params }
    );
  }
}