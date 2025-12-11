import { ApplicationRef, ComponentRef, EnvironmentInjector, Injectable, createComponent } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { GlowToastComponent } from './glow-toast';

@Injectable({ providedIn: 'root' })
export class GlowToastService {
  private container?: HTMLElement;
  private toasts: ComponentRef<GlowToastComponent>[] = [];

  private icons: Record<'success'|'error'|'info'|'warning'|'update'|'delete', string> = {
    success: '/assets/icons/icon-success.svg',
    error:   '/assets/icons/icon-error.svg',
    info:    '/assets/icons/icon-info.svg',
    warning: '/assets/icons/icon-warning.svg',
    update:  '/assets/icons/icon-arrows-clockwise.svg',
    delete:  '/assets/icons/icon-delete.svg'
  };

  constructor(private appRef: ApplicationRef, private injector: EnvironmentInjector) {}

  open(
    title: string,
    message: string,
    cfg?: { duration?: number; type?: 'success'|'error'|'info'|'warning'|'update'|'delete'; actionText?: string; action?: () => void; }
  ) {
    const ref = createComponent(GlowToastComponent, { environmentInjector: this.injector });
    const type = cfg?.type ?? 'info';

    ref.instance.title = title;
    ref.instance.message = message;
    ref.instance.type = type;
    ref.instance.icon = this.icons[type];
    ref.instance.duration = cfg?.duration ?? 3000;
    if (cfg?.action) { ref.instance.actionText = cfg.actionText ?? 'Aceptar'; ref.instance.action = cfg.action; }

    this.mount(ref);

    const closed$ = new ReplaySubject<void>(1);
    ref.instance.afterClosed$.subscribe(() => { this.unmount(ref); closed$.next(); closed$.complete(); });

    return closed$.asObservable();
  }

  success(msg: string, title='Éxito', d?: number)      { return this.open(title, msg, { type:'success', duration:d }); }
  error(msg: string, title='Error', d?: number)        { return this.open(title, msg, { type:'error',  duration:d }); }
  info(msg: string, title='Información', d?: number)   { return this.open(title, msg, { type:'info',   duration:d }); }
  warning(msg: string, title='Advertencia', d?: number){ return this.open(title, msg, { type:'warning',duration:d }); }

  private ensureContainer() {
    if (this.container) return;
    const el = document.createElement('div');
    Object.assign(el.style, {
      position:'fixed', top:'16px', right:'16px',
      display:'flex', flexDirection:'column', gap:'10px',
      zIndex:'10050', pointerEvents:'none'
    } as CSSStyleDeclaration);
    document.body.appendChild(el);
    this.container = el;
  }

  private mount(ref: ComponentRef<GlowToastComponent>) {
    this.ensureContainer();
    const host = ref.location.nativeElement as HTMLElement;
    host.style.pointerEvents = 'auto';
    this.appRef.attachView(ref.hostView);
    this.container!.appendChild(host);
    this.toasts.push(ref);
  }

  private unmount(ref: ComponentRef<GlowToastComponent>) {
    const i = this.toasts.indexOf(ref);
    if (i > -1) this.toasts.splice(i, 1);
    this.appRef.detachView(ref.hostView);
    ref.location.nativeElement.remove();
    if (this.toasts.length === 0 && this.container) { this.container.remove(); this.container = undefined!; }
  }
}
