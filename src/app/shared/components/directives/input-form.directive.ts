import { Directive, HostBinding, HostListener, Input, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[authenticationInput], textarea[authenticationInput], select[authenticationInput]',
  standalone: true,
  host: {
    class:
      'block w-full rounded-lg bg-white text-[15px] px-3 py-2.5 ' +
      'placeholder:text-slate-400 outline-none transition border'
  }
})
export class InputDirective {
  private ngc = inject(NgControl, { optional: true });

  private focused = false;

  private get c()              { return this.ngc?.control || null; }
  private get touched()        { return !!(this.c && (this.c.touched || this.c.dirty)); }
  private get invalidTouched() { return !!(this.c && this.c.invalid && this.touched); }
  private get validTouched()   { return !!(this.c && this.c.valid   && this.touched); }

  @HostBinding('class.border-slate-300')
  get baseGrey() {
    return !this.invalidTouched && !this.focused;
  }

  @HostBinding('class.border-sa-accent')
  get focusOkBorder() {
    return this.focused && !this.invalidTouched;
  }

  @HostBinding('class.border-red-300')
  get errorBorder() {
    return this.invalidTouched;
  }

  @HostListener('focus') onFocus() { this.focused = true; }
  @HostListener('blur')  onBlur()  { this.focused = false; }

  @Input() @HostBinding('class.opacity-60') disabled = false;
  @HostBinding('attr.disabled') get attrDisabled() { return this.disabled ? '' : null; }
}
