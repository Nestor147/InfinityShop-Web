import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'authentication-loader',
  imports: [CommonModule],
  templateUrl: './authentication-loader.html',
  styleUrl: './authentication-loader.scss'
})
export class AuthenticationLoader {
  @Input() isLoading = false;
  @Input() message = 'Autenticando…';
}
