import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html'
})
export default class Login {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  loading = false;
  errorMsg = '';
  showPassword = false;
  year = new Date().getFullYear();

  form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  togglePassword() { this.showPassword = !this.showPassword; }

  submit() {
    if (this.form.invalid || this.loading) return;
    const { username, password } = this.form.getRawValue();
    this.loading = true;
    this.errorMsg = '';
    this.auth.login({ username, password, applicationId:10 })
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          const backendMessage = err?.error?.message ?? '';
          const backendDetail = err?.error?.detail ?? '';
          if (
            err?.status === 400 ||
            err?.status === 401 ||
            backendMessage === 'Auth error'
          ) {
            this.errorMsg = 'Usuario o contraseña incorrectos. Verifica tus datos e inténtalo de nuevo.';
            return;
          }
          if (backendDetail) {
            this.errorMsg = backendDetail;
            return;
          }
          this.errorMsg = 'Ocurrió un error al iniciar sesión. Inténtalo nuevamente más tarde.';
        }
      });
  }
}
