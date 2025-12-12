# Ejemplo de uso del InputValidatorComponent

## Con tooltip de ayuda

```typescript
// En tu componente
<app-input-validator
  label="Correo Electrónico"
  placeholder="ejemplo@correo.com"
  type="email"
  [formGroup]="miFormulario"
  controlName="email"
  [control]="miFormulario.get('email')!"
  [errorMessages]="{
    required: 'El correo es obligatorio',
    email: 'Ingrese un correo válido'
  }"
  helpTooltip="Ingrese su dirección de correo electrónico para recibir notificaciones y recuperar su contraseña en caso necesario.">
</app-input-validator>
```

## Sin tooltip (no se muestra el ícono de interrogación)

```typescript
<app-input-validator
  label="Nombre de Usuario"
  placeholder="Ingrese su nombre"
  type="text"
  [formGroup]="miFormulario"
  controlName="username"
  [control]="miFormulario.get('username')!"
  [errorMessages]="{
    required: 'El nombre es obligatorio',
    minlength: 'Mínimo 3 caracteres'
  }">
</app-input-validator>
```

## Con Switch

```typescript
<app-input-validator
  label="¿Recibir notificaciones?"
  [formGroup]="miFormulario"
  controlName="notifications"
  [control]="miFormulario.get('notifications')!"
  [isSwitch]="true"
  switchYesText="Sí"
  switchNoText="No"
  helpTooltip="Active esta opción para recibir notificaciones por correo sobre cambios importantes en su cuenta.">
</app-input-validator>
```

## Características del tooltip

- **Solo aparece** si se proporciona el parámetro `helpTooltip`
- Se muestra al pasar el mouse sobre el ícono **?**
- Tiene una **flecha** que apunta al ícono
- Usa colores de **Tailwind CSS** (blue-500, gray-800)
- Es **responsive** y se posiciona automáticamente
- Tiene **animaciones suaves**
