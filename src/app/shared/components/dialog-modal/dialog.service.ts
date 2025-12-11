import {
  ApplicationRef,
  ComponentRef,
  EnvironmentInjector,
  Injectable,
  InjectionToken,
  TemplateRef,
  Type,
  ViewContainerRef,
  createComponent,
} from '@angular/core';
import { DialogConfigInterface } from './models/dialog-config.interface';
import { Observable, Subscription } from 'rxjs';
import { DialogActionInterface } from './models/dialog-action.interface';
import { DialogModal } from './dialog-modal';

export const DIALOG_DATA = new InjectionToken<any>('DialogData');

@Injectable({ providedIn: 'root' })
export class DialogService implements DialogActionInterface {
  newModalComponent!: ComponentRef<DialogModal>;
  dialogConfig!: DialogConfigInterface | undefined;

  // para limpiar al cerrar
  private contentRef?: ComponentRef<any>;
  private afterCloseSub?: Subscription;

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) { }

  // Si quieres exponerlo, ahora sí existe
  afterClosed(): Observable<any> {
    if (!this.newModalComponent) {
      throw new Error('No hay diálogo abierto.');
    }
    return this.newModalComponent.instance.afterClosed$;
  }

  open<C>(
    vcrOrComponent: ViewContainerRef | Type<C>,
    param2?: TemplateRef<Element> | DialogConfigInterface,
    dialogConfig?: DialogConfigInterface
  ): DialogActionInterface {
    // Limpia posibles anteriores instancias
    this.#teardown();

    if (vcrOrComponent instanceof ViewContainerRef) {
      this.openWithTemplate(vcrOrComponent, param2 as TemplateRef<Element>);
      this.dialogConfig = dialogConfig;
    } else {
      this.dialogConfig = param2 as DialogConfigInterface | undefined;
      this.openWithComponent(vcrOrComponent);
    }

    // pasar config al modal
    if (this.dialogConfig && this.newModalComponent?.instance) {
      this.newModalComponent.instance.config = this.dialogConfig;
    }

    // suscribirse a afterClosed$ para destruir
    this.afterCloseSub = this.newModalComponent.instance.afterClosed$.subscribe({
      next: (result) => this.#destroyModal(result),
      complete: () => this.#destroyModal(),
    });

    return this;
  }

  private openWithTemplate(vcr: ViewContainerRef, content: TemplateRef<Element>) {
    vcr.clear();
    const innerContent = vcr.createEmbeddedView(content);
    this.newModalComponent = vcr.createComponent(DialogModal, {
      environmentInjector: this.injector,
      projectableNodes: [innerContent.rootNodes],
    });
  }

  private openWithComponent(component: Type<unknown>) {
    // componente de contenido
    const contentComponent = createComponent(component, {
      environmentInjector: this.injector,
    });
    this.contentRef = contentComponent;

    // modal que proyecta el contenido
    this.newModalComponent = createComponent(DialogModal, {
      environmentInjector: this.injector,
      projectableNodes: [[contentComponent.location.nativeElement]],
    });

    document.body.appendChild(this.newModalComponent.location.nativeElement);

    // attach al ciclo de CD
    this.appRef.attachView(contentComponent.hostView);
    this.appRef.attachView(this.newModalComponent.hostView);
  }

  /** Solicita cerrar (dispara animación en el componente) */
  close(returnValue: any = null) {
    if (!this.newModalComponent) return;
    this.newModalComponent.instance.close(returnValue);
  }

  /** Destruye/limpia el modal y el contenido */
  #destroyModal(_result?: any) {
    // Detach/destroy modal
    if (this.newModalComponent) {
      this.appRef.detachView(this.newModalComponent.hostView);
      this.newModalComponent.destroy();
    }
    // Detach/destroy contenido si existe
    if (this.contentRef) {
      this.appRef.detachView(this.contentRef.hostView);
      this.contentRef.destroy();
      this.contentRef = undefined;
    }
    // cancelar suscripción
    if (this.afterCloseSub) {
      this.afterCloseSub.unsubscribe();
      this.afterCloseSub = undefined;
    }
    this.newModalComponent = undefined as any;
  }

  /** Limpia cualquier rastro de una apertura previa antes de abrir otra */
  #teardown() {
    if (this.newModalComponent) {
      this.#destroyModal();
    }
  }

  // Stub para cumplir la interfaz; impleméntalo si lo usas
  alert(_opts: { title: string; message: string; type: string }) {
    throw new Error('Method not implemented.');
  }
}
