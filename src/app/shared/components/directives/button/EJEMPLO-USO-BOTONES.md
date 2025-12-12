# Ejemplo de uso de Botones con Spinner

## ButtonDefaultDirective (Botón Principal)

### Uso básico
```html
<button buttonDefault>
  Guardar
</button>
```

### Con spinner de carga
```html
<button buttonDefault [loading]="isLoading">
  <app-button-spinner [loading]="isLoading" size="sm"></app-button-spinner>
  <span>{{ isLoading ? 'Guardando...' : 'Guardar' }}</span>
</button>
```

### Botón de ancho completo
```html
<button buttonDefault full>
  Continuar
</button>
```

### Con loading y ancho completo
```html
<button buttonDefault full [loading]="isSubmitting">
  <app-button-spinner [loading]="isSubmitting" size="sm"></app-button-spinner>
  <span>{{ isSubmitting ? 'Enviando...' : 'Enviar Formulario' }}</span>
</button>
```

---

## ButtonCancelDirective (Botón Secundario/Cancelar)

### Uso básico
```html
<button buttonCancel>
  Cancelar
</button>
```

### Con spinner de carga
```html
<button buttonCancel [loading]="isProcessing">
  <app-button-spinner [loading]="isProcessing" size="sm"></app-button-spinner>
  <span>{{ isProcessing ? 'Procesando...' : 'Descartar' }}</span>
</button>
```

---

## Ejemplo completo en componente

### TypeScript
```typescript
import { Component } from '@angular/core';
import { ButtonDefaultDirective } from './directives/button-default.directive';
import { ButtonCancelDirective } from './directives/button-cancel.directive';
import { ButtonSpinnerComponent } from './button-spinner/button-spinner.component';

@Component({
  selector: 'app-ejemplo',
  standalone: true,
  imports: [
    ButtonDefaultDirective,
    ButtonCancelDirective,
    ButtonSpinnerComponent
  ],
  template: `
    <div class="flex gap-3">
      <button buttonCancel (click)="onCancel()">
        Cancelar
      </button>

      <button buttonDefault [loading]="isLoading" (click)="onSave()">
        <app-button-spinner [loading]="isLoading" size="sm"></app-button-spinner>
        <span>{{ isLoading ? 'Guardando...' : 'Guardar' }}</span>
      </button>
    </div>
  `
})
export class EjemploComponent {
  isLoading = false;

  async onSave() {
    this.isLoading = true;
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Guardado exitosamente');
    } finally {
      this.isLoading = false;
    }
  }

  onCancel() {
    console.log('Cancelado');
  }
}
```

---

## Paleta de colores utilizada

### ButtonDefaultDirective
- **Normal**: `bg-sa-accent` (#0ea5e9) con `text-white`
- **Hover**: `bg-sa-info` (#38bdf8)
- **Disabled/Loading**: `bg-sa-gray-300` (#d1d5db) con `opacity-50`
- **Focus**: `ring-sa-accent-soft` (#e0f2fe)
- **Sombra**: `shadow-md` → `shadow-lg` en hover

### ButtonCancelDirective
- **Normal**: `bg-sa-surface` (#f9fafb) con `text-sa-ink` (#0f172a)
- **Hover**: `bg-sa-surface-alt` (#e5e7eb)
- **Border**: `border-sa-border` (#e5e7eb)
- **Disabled/Loading**: `bg-sa-gray-300` (#d1d5db) con `opacity-50`
- **Focus**: `ring-sa-border` (#e5e7eb)
- **Sombra**: `shadow-sm` → `shadow-md` en hover

---

## Características

**Paleta de colores personalizada** de `src/tailwind.css`
**Spinner de carga** integrado
**Auto-disable** cuando `loading=true`
**Transiciones suaves** con `transition-all duration-200`
**Efecto de escala** al hacer clic (`active:scale-95`)
**Ancho completo** opcional con `full`
**Estados de accesibilidad** (focus, disabled, aria)
