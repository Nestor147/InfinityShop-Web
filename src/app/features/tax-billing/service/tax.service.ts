import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { ApiResponse } from '../../../core/models/authentication-response/reponse-authentication.interface';
import { ComboBox } from '../../../shared/combo-box';

@Injectable({
  providedIn: 'root'
})
export class TaxService {
  #http = inject(HttpClient);
  #baseUrl = `${environment.apiUrl}/Tax`;

  getComboTaxes() {
    return this.#http.get<ApiResponse<ComboBox>>(`${this.#baseUrl}/GetComboTax`);
  }
}
