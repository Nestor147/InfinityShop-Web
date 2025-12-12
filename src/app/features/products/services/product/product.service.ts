import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { MasterTableResponse } from '../../../../shared/models/interface/response-master-table.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  #http = inject(HttpClient);
  #baseUrl = `${environment.apiUrl}/Product`;

  getAllProducts(
    CategoryId: string,
    PageSize: number,
    PageNumber: number,
    SearchText?: string
  ): Observable<MasterTableResponse> {
    let params = new HttpParams()
      .set('CategoryId', CategoryId)
      .set('PageSize', PageSize)
      .set('PageNumber', PageNumber);

    if (SearchText && SearchText.trim() !== '') {
      params = params.set('SearchText', SearchText);
    }
    return this.#http.get<MasterTableResponse>(`${this.#baseUrl}/GetAllProducts`, { params });
  }

  deleteProductById(id: string): Observable<any> {
    return this.#http.post(`${this.#baseUrl}/DeleteProductById`, `"${id}"`, {
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*'
      }
    });
  }
}
