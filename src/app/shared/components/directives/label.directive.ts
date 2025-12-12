// label.directive.ts
import { Directive, HostBinding, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Directive({
  selector: 'label[authenticationLabel]',
  standalone: true,
  host: { class: 'inline-block mb-1 text-sm font-medium select-none' }
})
export class LabelDirective {
  @Input() formGroup?: FormGroup;
  @Input() controlName?: string;

  private get control(): AbstractControl | null {
    return this.formGroup && this.controlName ? this.formGroup.get(this.controlName) : null;
  }
  private get invalidTouched(): boolean {
    const c = this.control;
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  @HostBinding('class.text-red-500') get red() { return this.invalidTouched; }
  @HostBinding('class.text-slate-700') get base() { return !this.invalidTouched; }
}
