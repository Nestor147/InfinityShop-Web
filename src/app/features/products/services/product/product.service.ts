import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { MasterTableResponse } from '../../../../shared/models/interface/response-master-table.interface';
import { Observable } from 'rxjs';
import { ProductInterface } from '../../pages/product-managment/interface/product-ionterface';
import { LangService } from '../../../../shared/services/lang/language.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  #http = inject(HttpClient);
  #langService = inject(LangService);
  #baseUrl = `${environment.apiUrl}/Product`;

  getAllProducts(
    CategoryId: string,
    PageSize: number,
    PageNumber: number,
    SearchText?: string
  ): Observable<MasterTableResponse> {
    const currentLang = this.#langService.lang();

    let params = new HttpParams()
      .set('CategoryId', CategoryId)
      .set('PageSize', PageSize)
      .set('PageNumber', PageNumber)
      .set('Lang', currentLang);

    if (SearchText && SearchText.trim() !== '') {
      params = params.set('SearchText', SearchText);
    }
    return this.#http.get<MasterTableResponse>(`${this.#baseUrl}/GetAllProducts`, { params });
  }

  insertProduct(request: ProductInterface): Observable<any> {
    return this.#http.post<any>(
      `${this.#baseUrl}/InsertProduct`,
      request
    );
  }

  updateProduct(request: ProductInterface): Observable<any> {
    return this.#http.post<any>(
      `${this.#baseUrl}/UpdateProduct`,
      request
    );
  }

  getProductById(id: string): Observable<any> {
    const params = new HttpParams().set('id', id);

    return this.#http.get<any>(
      `${this.#baseUrl}/GetProductById`,
      { params }
    );
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
