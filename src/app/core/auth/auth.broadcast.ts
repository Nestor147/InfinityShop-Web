import { Injectable } from '@angular/core';
import { AuthTokens } from './auth.tokens';

type AuthMsg =
  | { type: 'logout' }
  | { type: 'login'; accessToken: string; refreshToken?: string };

@Injectable({ providedIn: 'root' })
export class AuthBroadcast {
  private ch = new BroadcastChannel('auth');

  constructor(private tokens: AuthTokens) {
    this.ch.onmessage = (e: MessageEvent<AuthMsg>) => {
      if (e.data?.type === 'logout') this.tokens.clear();
      if (e.data?.type === 'login' && e.data.accessToken) {
        this.tokens.setTokens(
          e.data.accessToken,
          e.data.refreshToken ?? this.tokens.refreshToken()
        );
      }
    };
  }

  announceLogin(payload: { accessToken: string; refreshToken?: string }) {
    this.ch.postMessage({ type: 'login', ...payload } as AuthMsg);
  }

  announceLogout() {
    this.ch.postMessage({ type: 'logout' } as AuthMsg);
  }
}
