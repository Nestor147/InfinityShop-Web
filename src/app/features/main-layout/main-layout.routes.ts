import { Routes } from '@angular/router';
import MainLayoutComponent from './pages/main-layout/main-layout';
import ProductsLayout from '../products/pages/products-layout/products-layout';
const mainLayoutRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '' },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '',
        loadComponent: () => import('./pages/main-dashboard/main-dashboard')
      },
      {
        path: 'products',
        component: ProductsLayout,
        loadChildren: () => import('../products/products.routes')
      },
      {
        path: 'company',
        loadComponent: () => import('../core/company/index/company')
      },
      {
        path: 'currency',
        loadComponent: () => import('../core/currency/index/currency')
      },
      {
        path: 'category',
        loadComponent: () => import('../core/category/index/category')
      },
      {
        path: 'design1',
        loadComponent: () => import('../design/design1/design1')
      },
      {
        path: 'design2',
        loadComponent: () => import('../design/design2/design2')
      }
    ]
  },
];
export default mainLayoutRoutes;
