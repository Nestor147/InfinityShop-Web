// /core/interceptors/auth-token.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AuthTokens } from '../auth/auth.tokens';
import { TokenRefreshService } from '../auth/token-refresh.service';
import { SKIP_AUTH } from '../auth/auth.context';

const API_BASE = (environment.apiUrl ?? 'https://masterautenticacion.backendatacado.com/api/Auth/sessions/api').replace(/\/+$/, '');
const AUTH_PREFIX = `${API_BASE}/Auth/`;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokens = inject(AuthTokens);
  const refresher = inject(TokenRefreshService);

  // Bypass explícito
  if (req.context.get(SKIP_AUTH)) return next(req);

  const isApi = req.url.startsWith(API_BASE);
  const isAuthCall = req.url.startsWith(AUTH_PREFIX);

  const attach = (r: typeof req) => {
    const at = tokens.accessToken();
    return at ? r.clone({ setHeaders: { Authorization: `Bearer ${at}` } }) : r;
  };

  const preRefresh = tokens.willExpireSoon();
  const run = () => next(attach(req)).pipe(
    catchError((err: HttpErrorResponse) => {
      const alreadyRetried = req.headers.has('X-Auth-Retry');
      if (err.status === 401 && isApi && !isAuthCall && !alreadyRetried && tokens.refreshToken()) {
        return refresher.refreshOnce().pipe(
          switchMap(() => next(attach(req.clone({ setHeaders: { 'X-Auth-Retry': '1' } }))))
        );
      }
      return throwError(() => err);
    })
  );

  return preRefresh ? refresher.refreshOnce().pipe(switchMap(() => run())) : run();
};
