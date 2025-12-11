import { Injectable, computed, signal } from '@angular/core';

const ACCESS_KEY  = 'atish.at';
const REFRESH_KEY = 'atish.rt';

const S = sessionStorage;

type JwtPayload = { exp?: number; iat?: number; [k: string]: any };

@Injectable({ providedIn: 'root' })
export class AuthTokens {
  private _at = signal<string | null>(S.getItem(ACCESS_KEY));
  private _rt = signal<string | null>(S.getItem(REFRESH_KEY));

  accessToken = this._at.asReadonly();
  refresh = this._rt.asReadonly();

  private tryDecode(token: string | null): JwtPayload | null {
    if (!token) return null;
    try { return jwtDecode<JwtPayload>(token); }
    catch { return null; }
  }

  payload = computed<JwtPayload | null>(() => this.tryDecode(this._at()));

  isAuthenticated(skewSeconds = 60): boolean {
    const at = this._at();
    if (!at) return false;

    const p = this.payload();
    if (!p?.exp) {
      return true;
    }
    const now = Date.now();
    return p.exp * 1000 > (now - skewSeconds * 1000);
  }

  willExpireSoon(windowSeconds = 15): boolean {
    const exp = this.payload()?.exp;
    return !!exp && exp * 1000 - Date.now() <= windowSeconds * 1000;
  }

  setTokens(at: string | null, rt: string | null) {
    this._at.set(at);
    this._rt.set(rt);
    if (at) S.setItem(ACCESS_KEY, at); else S.removeItem(ACCESS_KEY);
    if (rt) S.setItem(REFRESH_KEY, rt); else S.removeItem(REFRESH_KEY);
  }

  refreshToken(): string | null { return this._rt(); }
  clear() { this.setTokens(null, null); }
}
function jwtDecode<T>(token: string): JwtPayload | null {
  throw new Error('Function not implemented.');
}

