import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';
import { MenuItemInterface } from '../../../../shared/models/main-menu-bus/menu-section.interface';

@Component({
  selector: 'main-btn-system',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, SvgIconComponent],
  templateUrl: './btn-system.component.html',
  styleUrl: './btn-system.component.scss',
})
export class BtnSystemComponent {
  @Input() name!: string;
  @Input() icon!: string;
  @Input() route?: string | any[];

  @Input() variant: 'row' | 'tile' = 'row';
  @Input() showArrow = false;
  @Input() arrowIcon = 'assets/icons/icon-arrow-right-short.svg';

  @Input() children: MenuItemInterface[] | null = null;

  @Output() openSubmenu = new EventEmitter<{
    title: string;
    items: MenuItemInterface[];
    route?: string | any[];
  }>();

  onRowClick(ev: MouseEvent) {
    if (this.children?.length) {
      ev.preventDefault();
      ev.stopPropagation();
      this.openSubmenu.emit({ title: this.name, items: this.children, route: this.route });
    }
  }
}
