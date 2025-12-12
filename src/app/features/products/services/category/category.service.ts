import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { ApiResponse } from '../../../../core/models/authentication-response/reponse-authentication.interface';
import { ComboCategory } from '../../models/category/combo-category.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  #http = inject(HttpClient);
  #baseUrl = `${environment.apiUrl}/Category`;

  getComboCategories() {
    return this.#http.get<ApiResponse<ComboCategory>>(`${this.#baseUrl}/GetComboCategories`);
  }
}
