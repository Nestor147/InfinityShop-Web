import { Component, computed, EventEmitter, inject, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SvgIconComponent } from 'angular-svg-icon';
import { DialogService } from '../dialog-modal/dialog.service';
import { ButtonDefaultDirective } from '../directives/button/button-default.directive';
import { ButtonCancelDirective } from '../directives/button/button-cancel.directive';
type ModalType = 'success' | 'error' | 'info' | 'warning';

@Component({
  selector: 'app-authorize-confirm',
  imports: [CommonModule, FormsModule, SvgIconComponent, ButtonDefaultDirective, ButtonCancelDirective],
  templateUrl: './authorize-confirm.component.html'
})
export class AuthorizeConfirmComponent {
  #dialog = inject(DialogService);

  title: string = this.#dialog.dialogConfig?.data.title ?? 'Confirmar acción';
  message1: string = this.#dialog.dialogConfig?.data.message1 ?? 'Esta acción es sensible.';
  message2: string = this.#dialog.dialogConfig?.data.message2 ?? 'Para continuar, escribe la frase de confirmación.';
  type: ModalType = this.#dialog.dialogConfig?.data.type ?? 'warning';

  expectedText: string = this.#dialog.dialogConfig?.data.expectedText ?? 'CONFIRMAR';

  inputValue = signal<string>('');

  private normalize = (v: string) => v?.trim().toLowerCase() ?? '';
  isMatch = computed(() => this.normalize(this.inputValue()) === this.normalize(this.expectedText));

  @Output() confirm = new EventEmitter<boolean>();

  get iconColorClass(): string {
    const colorMap: Record<ModalType, string> = {
      'success': 'text-sa-accent bg-sa-accent/10 border-sa-accent/20',
      'error': 'text-sa-error bg-sa-error/10 border-sa-error/20',
      'warning': 'text-sa-warning bg-sa-warning/10 border-sa-warning/20',
      'info': 'text-sa-info bg-sa-info/10 border-sa-info/20'
    };
    return colorMap[this.type] || colorMap['info'];
  }

  get borderColorClass(): string {
    const colorMap: Record<ModalType, string> = {
      'success': 'border-sa-accent',
      'error': 'border-sa-error',
      'warning': 'border-sa-warning',
      'info': 'border-sa-info'
    };
    return colorMap[this.type] || colorMap['info'];
  }

  get pillColorClass(): string {
    const colorMap: Record<ModalType, string> = {
      'success': 'text-sa-accent border-sa-accent',
      'error': 'text-sa-error border-sa-error',
      'warning': 'text-sa-warning border-sa-warning',
      'info': 'text-sa-info border-sa-info'
    };
    return colorMap[this.type] || colorMap['info'];
  }

  onClose() {
    this.#dialog.close(false);
  }

  onConfirm() {
    if (this.isMatch()) {
      this.#dialog.close(true);
      this.confirm.emit(true);
    }
  }
}