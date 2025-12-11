import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthTokens } from './auth.tokens';
import { SKIP_AUTH } from './auth.context';
import { AuthBroadcast } from './auth.broadcast';
import { environment } from '../../../environments/environment.development';

type TokenPair = { accessToken: string; refreshToken: string };
type LoginRequest = { username: string; password: string; applicationId:number };
type RefreshRequest = { refreshToken: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokens = inject(AuthTokens);
  private readonly router = inject(Router);
  private readonly broadcast = inject(AuthBroadcast);

  private readonly api = ('https://masterautenticacion.backendatacado.com/api').replace(/\/+$/, '');
  private readonly ctx = new HttpContext().set(SKIP_AUTH, true);

  login(body: LoginRequest): Observable<TokenPair> {
    return this.http
      .post<TokenPair>(`${this.api}/Auth/login`, body, { context: this.ctx })
      .pipe(
        tap(p => {
          this.tokens.setTokens(p.accessToken, p.refreshToken);
          this.broadcast.announceLogin({
            accessToken: p.accessToken,
            refreshToken: p.refreshToken,
          });
        })
      );
  }

  refresh(): Observable<TokenPair> {
    const rt = this.tokens.refreshToken();
    return this.http
      .post<TokenPair>(
        `${this.api}/Auth/refresh`,
        { refreshToken: rt } as RefreshRequest,
        { context: this.ctx }
      )
      .pipe(
        tap(p => {
          this.tokens.setTokens(p.accessToken, p.refreshToken);
          this.broadcast.announceLogin({
            accessToken: p.accessToken,
            refreshToken: p.refreshToken,
          });
        })
      );
  }

  logout(): void {
    const rt = this.tokens.refreshToken();
    this.tokens.clear();
    this.broadcast.announceLogout();
    if (rt) {
      this.http
        .post(
          `${this.api}/Auth/logout`,
          { refreshToken: rt } as RefreshRequest,
          { context: this.ctx }
        )
        .subscribe({
          error: () => {
          },
        });
    }
    this.router.navigateByUrl('/auth/login');
  }
}
