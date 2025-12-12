// input-validator.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputDirective } from '../directives/input-form.directive';
import { LabelDirective } from '../directives/label.directive';


@Component({
  selector: 'app-input-validator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputDirective, LabelDirective],
  templateUrl: './input-validator.component.html'
})
export class InputValidatorComponent {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: 'text'|'url'|'email'|'password' = 'text';
  @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: true }) controlName!: string;
  @Input({ required: true }) control!: AbstractControl;
  @Input() errorMessages: Record<string, string> = {};
  @Input() isSelect = false;
  @Input() isTextarea = false;
  @Input() isSwitch = false;
  @Input() rows = 3;
  @Input() resize = true;
  @Input() minLength?: number;
  @Input() maxLength?: number;
  @Input() required?: boolean;
  @Input() switchNoText: string = 'No';
  @Input() switchYesText: string = 'Sí';
  @Input() helpTooltip?: string; 
  isRequired = false;
  showTooltip = false;

  ngOnInit(): void {
    if (this.required !== undefined) {
      this.isRequired = !!this.required;
    } else if (this.control) {
      const anyCtrl = this.control as any;
      if (typeof anyCtrl.hasValidator === 'function') {
        this.isRequired = anyCtrl.hasValidator(Validators.required);
      } else {
        const probe = new FormControl('');
        const err = this.control.validator?.(probe as any);
        this.isRequired = !!(err && (err as any)['required']);
      }
    }
  }

  get isInvalid(): boolean {
    const c = this.control;
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  get firstError(): string | null {
    if (this.isInvalid && this.control.errors) {
      const key = Object.keys(this.control.errors)[0];
      return this.errorMessages[key] ?? 'Campo inválido';
    }
    return null;
  }

  get helperText(): string {
    if (this.isInvalid) return '';
    if (this.isSwitch) return '';
    if (this.minLength) return `Mínimo ${this.minLength} caracteres`;
    return '';
  }

  get charCount(): number {
    if (this.isSwitch) return 0;
    const v = (this.control?.value ?? '') as any;
    return typeof v === 'string' ? v.length : String(v ?? '').length;
  }

  setBool(v: boolean) {
    this.formGroup.get(this.controlName)?.setValue(v);
    this.formGroup.get(this.controlName)?.markAsDirty();
    this.formGroup.get(this.controlName)?.markAsTouched();
  }
}
