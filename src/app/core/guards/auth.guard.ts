// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router, UrlTree } from '@angular/router';
import { AuthTokens } from '../auth/auth.tokens';

function evaluate(): true | UrlTree {
  const router = inject(Router);
  const tokens = inject(AuthTokens);
  return tokens.isAuthenticated() ? true : router.parseUrl('/auth/login');
}

export const authCanMatch: CanMatchFn = () => evaluate();
export const authGuard: CanActivateFn = () => evaluate();
