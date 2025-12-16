import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { ApiResponse } from '../../../../core/models/authentication-response/reponse-authentication.interface';
import { ComboBrand } from '../interface/combo-brand.interface';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  #http = inject(HttpClient);
  #baseUrl = `${environment.apiUrl}/Brand`;

  GetComboBrands() {
    return this.#http.get<ApiResponse<ComboBrand>>(`${this.#baseUrl}/GetComboBrands`);
  }
}
