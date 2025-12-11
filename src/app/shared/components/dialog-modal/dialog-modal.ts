// dialog-modal.component.ts
import {
  AfterViewInit, Component, ElementRef, HostListener, Input,
  OnDestroy, ViewChild, inject
} from '@angular/core';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DialogConfigInterface } from './models/dialog-config.interface';
import { DialogService } from './dialog.service';

@Component({
  selector: 'app-dialog-modal',
  imports: [CommonModule],
  templateUrl: './dialog-modal.html',
  styleUrl: './dialog-modal.scss'
})
export class DialogModal implements AfterViewInit, OnDestroy {
  @Input() config?: DialogConfigInterface;

  /** Accesibilidad opcional si quieres setearlos desde fuera */
  @Input() titleId?: string;
  @Input() descId?: string;

  @ViewChild('modal', { static: true }) modalRef!: ElementRef<HTMLElement>;

  private _afterClosed$ = new Subject<any>();
  readonly afterClosed$ = this._afterClosed$.asObservable();

  #dialogService = inject(DialogService);
  #prevFocused?: Element | null;

  // ------------------ DRAG STATE ------------------
  private dragging = false;
  private startPointer = { x: 0, y: 0 };
  private startPos = { left: 0, top: 0 };
  private hasManualPos = false; // se activa al primer movimiento manual

  // Helper para saber si está habilitado el drag
  isDragEnabled(): boolean {
    // Por defecto TRUE; si viene false, se desactiva
    return this.config?.draggable !== false;
  }

  // =============== CICLO DE VIDA ==================
  ngAfterViewInit(): void {
    this.#applySizeFromConfig();

    // Bloquear scroll del body mientras el modal está abierto
    document.body.style.overflow = 'hidden';

    // Centrar y enfocar
    queueMicrotask(() => {
      this.#centerModal();
      this.#prevFocused = document.activeElement;
      this.modalRef.nativeElement.focus();
    });
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
    if (this.#prevFocused instanceof HTMLElement) this.#prevFocused.focus();
  }

  // =============== ACCESIBILIDAD / KEYS ===========
  @HostListener('document:keydown', ['$event'])
  onKeydown(ev: KeyboardEvent): void {
    if (ev.key === 'Escape') {
      if (this.config?.disableEsc) return; // respeta disableEsc
      ev.preventDefault();
      this.close();
      return;
    }
    if (ev.key === 'Tab') this.#trapFocus(ev);
  }

  onOverlayClick(): void {
    if (this.config?.disableClose) return;
    this.close();
  }

  private isInteractive(target: HTMLElement | null): boolean {
    if (!target) return false;
    return !!target.closest(
      'button, a, input, textarea, select, label, [role="button"], [contenteditable="true"], [tabindex]:not([tabindex="-1"])'
    );
  }

  onDragStart(ev: PointerEvent) {
    // Si el drag está deshabilitado, salir
    if (!this.isDragEnabled()) return;

    if (ev.button !== 0 || ev.altKey || ev.ctrlKey || ev.metaKey) return;
    if (this.isInteractive(ev.target as HTMLElement)) return;

    const modal = this.modalRef.nativeElement;
    ev.preventDefault();

    modal.classList.add('dialog--dragging');

    if (!this.hasManualPos) {
      const rect = modal.getBoundingClientRect();
      modal.style.left = `${rect.left}px`;
      modal.style.top = `${rect.top}px`;
      modal.style.transform = 'none';
      this.hasManualPos = true;
    }

    this.dragging = true;
    this.startPointer = { x: ev.clientX, y: ev.clientY };
    const { left, top } = modal.getBoundingClientRect();
    this.startPos = { left, top };

    document.addEventListener('pointermove', this.#onDragMove, { passive: false });
    document.addEventListener('pointerup', this.#onDragEnd, { passive: true });
    document.addEventListener('pointercancel', this.#onDragEnd, { passive: true });
  }

  #onDragMove = (ev: PointerEvent) => {
    if (!this.dragging) return;
    ev.preventDefault();

    const modal = this.modalRef.nativeElement;
    const dx = ev.clientX - this.startPointer.x;
    const dy = ev.clientY - this.startPointer.y;

    let nextLeft = this.startPos.left + dx;
    let nextTop  = this.startPos.top  + dy;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const rect = modal.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    const minLeft = 0;
    const minTop  = 0;
    const maxLeft = Math.max(0, vw - w);
    const maxTop  = Math.max(0, vh - h);

    nextLeft = Math.min(Math.max(nextLeft, minLeft), maxLeft);
    nextTop  = Math.min(Math.max(nextTop , minTop ), maxTop );

    modal.style.left = `${nextLeft}px`;
    modal.style.top  = `${nextTop }px`;
  };

  #onDragEnd = () => {
    if (!this.dragging) return;
    this.dragging = false;
    this.modalRef.nativeElement.classList.remove('dialog--dragging');

    document.removeEventListener('pointermove', this.#onDragMove);
    document.removeEventListener('pointerup', this.#onDragEnd);
    document.removeEventListener('pointercancel', this.#onDragEnd);
  };

  close(result?: any): void {
    const modalEl = this.modalRef?.nativeElement;
    const overlayEl = modalEl?.closest('.dialog-wrapper')
      ?.querySelector('.dialog-overlay') as HTMLElement | null;

    const finish = () => {
      this._afterClosed$.next(result);
      this._afterClosed$.complete();
    };

    if (!modalEl) { finish(); return; }

    modalEl.classList.remove('anim-enter-scale', 'anim-enter-slide');
    modalEl.classList.add('anim-leave-scale');

    if (overlayEl) {
      overlayEl.classList.remove('overlay-enter');
      overlayEl.classList.add('overlay-leave');
    }

    const cs = getComputedStyle(modalEl);
    const hasAnim =
      (cs.animationName || '').split(',').some(n => n.trim() && n.trim() !== 'none') &&
      (cs.animationDuration || '').split(',').some(d => d.trim() !== '0s' && d.trim() !== '0ms');

    if (!hasAnim) { finish(); return; }

    let done = false;
    const off = () => {
      if (done) return;
      done = true;
      modalEl.removeEventListener('animationend', onEnd);
      clearTimeout(timer);
      finish();
    };
    const onEnd = () => off();
    const timer = setTimeout(off, 600);

    modalEl.addEventListener('animationend', onEnd);
  }

  #applySizeFromConfig(): void {
    const el = this.modalRef?.nativeElement;
    const size = this.config?.size;
    if (!el || !size) return;

    if (size.width)     el.style.setProperty('--dlg-w',  size.width);
    if (size.maxWidth)  el.style.setProperty('--dlg-mw', size.maxWidth);
    if (size.height)    el.style.setProperty('--dlg-h',  size.height);
    if (size.maxHeight) el.style.setProperty('--dlg-mh', size.maxHeight);
  }

  #centerModal(): void {
    const modal = this.modalRef.nativeElement;

    const w = modal.offsetWidth;
    const h = modal.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const left = Math.max(0, (vw - w) / 2);
    const top  = Math.max(0, (vh - h) / 2);

    modal.style.left = `${left}px`;
    modal.style.top  = `${top }px`;
    modal.style.transform = 'none';
    this.hasManualPos = false;
  }

  @HostListener('window:resize')
  onResize() {
    if (!this.hasManualPos) this.#centerModal();
  }

  #trapFocus(ev: KeyboardEvent): void {
    const root = this.modalRef?.nativeElement;
    if (!root) return;

    const focusable = Array.from(
      root.querySelectorAll<HTMLElement>(
        [
          'a[href]',
          'button:not([disabled])',
          'textarea:not([disabled])',
          'input:not([type="hidden"]):not([disabled])',
          'select:not([disabled])',
          '[tabindex]:not([tabindex="-1"])',
          '[contenteditable="true"]'
        ].join(',')
      )
    ).filter((el) => !el.hasAttribute('inert'));

    if (focusable.length === 0) {
      ev.preventDefault();
      root.focus();
      return;
    }

    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (ev.shiftKey && active === first) {
      ev.preventDefault();
      last.focus();
    } else if (!ev.shiftKey && active === last) {
      ev.preventDefault();
      first.focus();
    }
  }
}
