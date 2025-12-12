import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-header',
  imports: [],
  templateUrl: './form-header.html',
  styleUrl: './form-header.scss',
})
export class FormHeader {
  @Input() title: string = '';
  @Input() subtitle: string = '';
}
