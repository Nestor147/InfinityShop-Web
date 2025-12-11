import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostBinding, OnDestroy, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'glow-toast',
  imports: [CommonModule, SvgIconComponent],
  templateUrl: './glow-toast.html',
  styleUrl: './glow-toast.scss',
  encapsulation: ViewEncapsulation.None
})
export class GlowToastComponent implements OnInit, OnDestroy {
  @Input() title = '';
  @Input() message = '';
  @Input() type: 'success'|'error'|'info'|'warning'|'update'|'delete' = 'info';
  @Input() icon = '';
  @Input() duration = 3000;
  @Input() actionText?: string;
  @Input() action?: () => void;

  @HostBinding('class')
  get hostClass() { return `glow-toast toast-container ${this.type}`; }

  private start = 0;
  private timer?: any;
  private remaining = 0;
  paused = false;

  #afterClosed = new ReplaySubject<void>(1);
  readonly afterClosed$ = this.#afterClosed.asObservable();

  constructor(private elRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.remaining = this.duration;
    this.startTimer();

    this.elRef.nativeElement.style.setProperty('--duration', `${this.duration}ms`);
  }

  ngOnDestroy(): void { if (this.timer) clearTimeout(this.timer); }

  private startTimer() {
    this.start = Date.now();
    this.timer = setTimeout(() => this.close(), this.remaining);
    this.paused = false;
  }

  pause() {
    if (this.paused) return;
    this.paused = true;
    clearTimeout(this.timer);
    const elapsed = Date.now() - this.start;
    this.remaining = Math.max(0, this.remaining - elapsed);
    this.elRef.nativeElement.classList.add('paused');
  }

  resume() {
    if (!this.paused) return;
    this.paused = false;
    this.elRef.nativeElement.classList.remove('paused');
    this.startTimer();
  }

  clickAction(ev: MouseEvent) {
    ev.stopPropagation();
    this.action?.();
    this.close();
  }

  close() {
    clearTimeout(this.timer);
    const el = this.elRef.nativeElement;
    el.classList.add('fade-out');
    const done = () => {
      this.#afterClosed.next(); this.#afterClosed.complete(); el.remove();
    };
    el.addEventListener('animationend', done, { once: true });
    setTimeout(done, 400);
  }
}
