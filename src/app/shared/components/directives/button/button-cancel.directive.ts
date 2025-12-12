// button-cancel.directive.ts
import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[buttonCancel]',
  standalone: true,
  host: {
    class:
      // layout
      'inline-flex items-center justify-center gap-2 select-none ' +
      // tamaño
      'h-10 px-4 rounded-lg text-sm font-semibold ' +
      // look claro con paleta personalizada
      'bg-sa-surface text-sa-ink border border-sa-border shadow-sm ' +
      // efectos
      'transition-all duration-200 hover:bg-sa-surface-alt hover:shadow-md active:scale-95 ' +
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sa-border focus-visible:ring-offset-2 ' +
      // disabled
      'cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-sa-gray-300'
  }
})
export class ButtonCancelDirective {
  @Input() set full(v: boolean | string) { this._full = v === '' || v === true || v === 'true'; }
  @Input() set loading(v: boolean | string) { this._loading = v === '' || v === true || v === 'true'; }

  private _full = false;
  private _loading = false;

  @HostBinding('class.w-full') get isFull() { return this._full; }
  @HostBinding('attr.type') readonly type = 'button';
  @HostBinding('attr.disabled') get isDisabled() { return this._loading || null; }
}
