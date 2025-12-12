import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: 'input[authenticationCounter], textarea[authenticationCounter]',
  standalone: true
})
export class CounterDirective implements AfterViewInit, OnDestroy {
  @Input() minLength?: number;
  @Input() maxLength?: number;

  private wrap!: HTMLElement;
  private left!: HTMLElement;
  private right!: HTMLElement;
  private unlisten?: () => void;

  constructor(
    private host: ElementRef<HTMLInputElement | HTMLTextAreaElement>,
    private r: Renderer2
  ) {}

  ngAfterViewInit(): void {
    const el = this.host.nativeElement;
    if (this.minLength == null) {
      const m = el.getAttribute('minlength');
      this.minLength = m ? parseInt(m, 10) : undefined;
    }
    if (this.maxLength == null) {
      const m = el.getAttribute('maxlength');
      this.maxLength = m ? parseInt(m, 10) : undefined;
    }

    this.wrap = this.r.createElement('div');
    // LITERAL aplicado al contenedor: no pasa por host metadata
    this.wrap.className = 'mt-1 flex items-center justify-between text-xs text-slate-500';

    this.left = this.r.createElement('span');
    this.right = this.r.createElement('span');
    this.r.appendChild(this.wrap, this.left);
    this.r.appendChild(this.wrap, this.right);

    const parent = el.parentNode as HTMLElement;
    parent.insertBefore(this.wrap, el.nextSibling);

    this.unlisten = this.r.listen(el, 'input', () => this.update());
    this.update();
  }

  ngOnDestroy(): void {
    this.unlisten?.();
    if (this.wrap?.parentNode) this.wrap.parentNode.removeChild(this.wrap);
  }

  private update() {
    const len = (this.host.nativeElement.value ?? '').length;
    this.left.textContent = this.minLength != null ? `Mínimo ${this.minLength} caracteres` : '';
    this.right.textContent = this.maxLength != null ? `${len}/${this.maxLength}` : `${len}`;
  }
}
