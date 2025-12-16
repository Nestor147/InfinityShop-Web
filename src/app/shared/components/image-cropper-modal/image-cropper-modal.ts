// import { CommonModule } from '@angular/common';
// import { Component, ElementRef, EventEmitter, inject, Input, OnDestroy, Output, ViewChild } from '@angular/core';
// import Cropper from 'cropperjs';
// import 'cropperjs/dist/cropper.css';
// import { CroppedImageInterface } from './cropped-image.interface';

// @Component({
//   selector: 'app-image-cropper-modal',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './image-cropper-modal.html'
// })
// export class ImageCropperModalComponent implements OnDestroy {

//   @Input() aspectRatio: number = 1; 
//   @Output() imageCropped = new EventEmitter<CroppedImageInterface>();

//   imageSrc: string | null = null;
//   croppedImage: string | null = null;
//   imageName: string | null = null;

//   cropper: Cropper | null = null;
//   visible: boolean = false;


//   @ViewChild('imageRef', { static: false }) imageElement!: ElementRef<HTMLImageElement>;
//   @ViewChild('fileInput', { static: false }) fileInputRef!: ElementRef<HTMLInputElement>;

// triggerFileInput() {

//   if (this.cropper) {
//     this.cropper.destroy();
//     this.cropper = null;
//   }
//   this.fileInputRef.nativeElement.value = ''; // Para que se dispare el change aunque selecciones el mismo archivo
//   this.fileInputRef.nativeElement.click();
// }

//   onImageSelected(event: Event) {
//     const file = (event.target as HTMLInputElement).files?.[0];
//     if (!file) return;

//     this.imageName = file.name;
//     const reader = new FileReader();
//     reader.onload = () => {
//       this.imageSrc = reader.result as string;
//       setTimeout(() => this.initCropper(), 50);
//     };
//     reader.readAsDataURL(file);
//   }

//   initCropper() {
//     if (this.cropper) {
//       this.cropper.destroy();
//     }
//     const image = this.imageElement?.nativeElement;
//     if (!image) return;

//     this.cropper = new Cropper(image, {
//       aspectRatio: this.aspectRatio,
//       viewMode: 1,
//       dragMode: 'move',
//       autoCropArea: 1,
//       responsive: true,
//       crop: () => this.updatePreview()
//     });
//   }

// updatePreview() {
//   if (!this.cropper) return;

//   const canvas = this.cropper.getCroppedCanvas({
//     imageSmoothingEnabled: true,
//     imageSmoothingQuality: 'high'
//   });

//   if (this.imageName?.toLowerCase().endsWith('.jpg') || this.imageName?.toLowerCase().endsWith('.jpeg')) {
//     this.croppedImage = canvas.toDataURL('image/jpeg', 0.95); // Calidad 95%
//   } else {
//     this.croppedImage = canvas.toDataURL('image/png'); // Sin pérdida
//   }
// }


//   zoomIn() { this.cropper?.zoom(0.1); }
//   zoomOut() { this.cropper?.zoom(-0.1); }


//   rotateLeft() { this.cropper?.rotate(-90); }
//   rotateRight() { this.cropper?.rotate(90); }


//   resetImage() { this.cropper?.reset(); }

//   onCancel() {
//     this.cropper?.destroy();
//     this.imageSrc = null;
//     this.croppedImage = null;
//   }

//   abrir() {
//   this.visible = true;
// }

// cerrar() {
//   this.visible = false;
//   this.imageSrc = null;
//   this.croppedImage = null;
//   this.cropper?.destroy();
// }




// onConfirm() {
//   if (this.croppedImage) {
//     const result: CroppedImageInterface = {
//       image: this.croppedImage,
//       name: this.imageName || 'imagen.png'
//     };
//     this.imageCropped.emit(result);
//   }
//   this.cerrar();
// }

//   ngOnDestroy() {
//     this.cropper?.destroy();
//   }

//   changeImage() {
//   // Resetear recorte previo pero mantener modal abierto
//   if (this.cropper) {
//     this.cropper.destroy();
//     this.cropper = null;
//   }
//   this.imageSrc = null;
//   this.croppedImage = null;

//   // Abrir selector de archivo
//   this.fileInputRef.nativeElement.value = '';
//   this.fileInputRef.nativeElement.click();
// }

// }
