// button-default.directive.ts
import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[buttonDefault]',
  standalone: true,
  host: {
    class:
      'inline-flex items-center justify-center gap-2 select-none ' +
      'h-10 px-5 rounded-lg text-sm font-semibold ' +
      'bg-sa-accent text-white shadow-md ' +
      // efectos
      'transition-all duration-200 hover:bg-sa-info hover:shadow-lg active:scale-95 ' +
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sa-accent-soft focus-visible:ring-offset-2 ' +
      // disabled
      'cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-sa-gray-300'
  }
})
export class ButtonDefaultDirective {
  @Input() set full(v: boolean | string) { this._full = v === '' || v === true || v === 'true'; }
  @Input() set loading(v: boolean | string) { this._loading = v === '' || v === true || v === 'true'; }

  private _full = false;
  private _loading = false;

  @HostBinding('class.w-full') get isFull() { return this._full; }
  @HostBinding('attr.type') readonly type = 'button';
  @HostBinding('attr.disabled') get isDisabled() { return this._loading || null; }
}
