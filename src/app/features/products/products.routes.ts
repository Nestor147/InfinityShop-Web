import { Routes } from "@angular/router";

const productsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'list-product',
    pathMatch: 'full'
  },
  {
    path: 'list-product',
    loadComponent: () =>
      import('./pages/product-managment/list-product/list-product'),
  }
];
export default productsRoutes;
