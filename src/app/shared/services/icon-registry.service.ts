import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

export type IconLib = 'material' | 'primeicons' | 'bootstrap' | 'remix';

@Injectable({ providedIn: 'root' })
export class IconRegistryService {
  private http = inject(HttpClient);

  private material$?: Observable<string[]>;
  private prime$?: Observable<string[]>;
  private bootstrap$?: Observable<string[]>;
  private remix$?: Observable<string[]>;

  getAll(lib: IconLib): Observable<string[]> {
    switch (lib) {
      case 'material':
        this.material$ ??= this.http
          .get<string[]>('/assets/icons/material-symbols-rounded.json')
          .pipe(map(l => l || []), shareReplay(1));
        return this.material$;

      case 'primeicons':
        this.prime$ ??= this.http
          .get<string[]>('/assets/icons/primeicons.json')
          .pipe(map(l => l || []), shareReplay(1));
        return this.prime$;

      case 'bootstrap':
        this.bootstrap$ ??= this.http
          .get<string[]>('/assets/icons/bootstrap-icons.json')
          .pipe(map(l => l || []), shareReplay(1));
        return this.bootstrap$;

      case 'remix':
        this.remix$ ??= this.http
          .get<string[]>('/assets/icons/remixicon.json')
          .pipe(map(l => l || []), shareReplay(1));
        return this.remix$;
    }
  }
}
