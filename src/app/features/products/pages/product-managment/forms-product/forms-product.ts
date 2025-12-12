import { Component, EventEmitter, Output } from '@angular/core';
import { FormHeader } from '../../../../../shared/components/form-header/form-header';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forms-product',
  imports: [FormHeader, FormsModule, CommonModule],
  templateUrl: './forms-product.html',
  styleUrl: './forms-product.scss',
})
export class FormsProduct {
  @Output() goBack = new EventEmitter<void>();

  product = {
    name: '',
    sku: '',
    category: '',
    subcategory: '',
    price: 0,
    stock: 0,
    unit: 'unit',
    description: '',
    status: 'active'
  };

  onSubmit() {
    console.log('Producto guardado:', this.product);
  }
}
