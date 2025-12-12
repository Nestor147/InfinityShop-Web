import { Directive } from '@angular/core';

@Directive({
  selector: 'span[authenticationError]',
  standalone: true,
  host: { class: 'mt-1 block text-xs text-red-500' }
})
export class ErrorDirective {}
