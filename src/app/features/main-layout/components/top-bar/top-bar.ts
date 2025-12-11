import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output, signal } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-top-bar',
  imports: [CommonModule],
  templateUrl: './top-bar.html'
})
export class TopBar {
  @Input() brand = 'Administración de Sistemas';
  @Input() envLabel?: string;
  @Input() userName = 'Superadmin';
  @Input() avatarText = 'SA';

  @Output() menuToggle = new EventEmitter<void>();
  @Output() action = new EventEmitter<string>();
  @Output() userAction = new EventEmitter<string>();

  launcherOpen = signal(false);
  userOpen = signal(false);

  private closeAll() {
    this.launcherOpen.set(false);
    this.userOpen.set(false);
  }

  @HostListener('document:keydown', ['$event'])
  onKey(ev: KeyboardEvent) {
    if (ev.key === 'Escape') this.closeAll();
  }

  @HostListener('document:click', ['$event'])
  closeOnOutside(ev: MouseEvent) {
    const el = ev.target as HTMLElement | null;
    if (!el) return;
    if (el.closest('[data-menu-root]')) return;
    this.closeAll();
  }

  onToggleLauncher(event: MouseEvent) {
    event.stopPropagation();
    const next = !this.launcherOpen();
    this.launcherOpen.set(next);
    if (next) this.userOpen.set(false); 
  }

  onToggleUser(event: MouseEvent) {
    event.stopPropagation();
    const next = !this.userOpen();
    this.userOpen.set(next);
    if (next) this.launcherOpen.set(false);
  }
}
