import { DialogConfigAnimationInterface } from './dialog-config-animation.interface';
import { DialogConfiSizeInterface } from './dialog-config-size.interface';

export interface DialogConfigInterface {
  animations?: DialogConfigAnimationInterface;
  size?: DialogConfiSizeInterface;
  data?: any;
  disableClose?: boolean;
  disableEsc?: boolean;
  draggable?: boolean;
}