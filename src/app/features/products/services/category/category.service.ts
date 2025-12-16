import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { ApiResponse } from '../../../../core/models/authentication-response/reponse-authentication.interface';
import { ComboCategory } from '../../models/category/combo-category.interface';
import { Observable } from 'rxjs';
import { MasterTable } from '../../../../shared/components/master-table/master-table';
import { MasterTableResponse } from '../../../../shared/models/interface/response-master-table.interface';
import { CategoryInterface } from '../../../core/category/interface/category.interface';
import { LangService } from '../../../../shared/services/lang/language.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  #http = inject(HttpClient);
  #langService = inject(LangService);
  #baseUrl = `${environment.apiUrl}/Category`;

  getDetailsCategory(
    PageSize: number,
    PageNumber: number,
    SearchText?: string
  ): Observable<MasterTableResponse> {
    let params = new HttpParams()
      .set('PageSize', PageSize)
      .set('PageNumber', PageNumber)
      .set('_t', Date.now().toString());
    if (SearchText && SearchText.trim() !== '') {
      params = params.set('SearchText', SearchText);
    }
    return this.#http.get<MasterTableResponse>(`${this.#baseUrl}/GetCategoriesPaginated`, { params });
  }

  insertCategory(request: CategoryInterface): Observable<any> {
    return this.#http.post<any>(
      `${this.#baseUrl}/InsertCategory`,
      request
    );
  }

  updateCategory(request: CategoryInterface): Observable<any> {
    return this.#http.post<any>(
      `${this.#baseUrl}/UpdateCategory`,
      request
    );
  }

  deleteCategoryById(id: string): Observable<any> {
    return this.#http.post<any>(
      `${this.#baseUrl}/DeleteCategoryById`,
      JSON.stringify(id),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  getCategoryById(id: string): Observable<any> {
    return this.#http.get<any>(
      `${this.#baseUrl}/GetCategoryById/${id}`
    );
  }

  getComboCategories() {
    return this.#http.get<ApiResponse<ComboCategory>>(`${this.#baseUrl}/GetComboCategories`);
  }
}
