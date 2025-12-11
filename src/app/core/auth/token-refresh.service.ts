import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, shareReplay, finalize } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TokenRefreshService {
  #auth = inject(AuthService);
  #inFlight$?: Observable<any>;

  refreshOnce(): Observable<any> {
    if (!this.#inFlight$) {
      this.#inFlight$ = this.#auth.refresh().pipe(
        shareReplay(1),
        finalize(() => { this.#inFlight$ = undefined; })
      );
    }
    return this.#inFlight$;
  }
}
