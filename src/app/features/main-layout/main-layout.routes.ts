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
        loadComponent: () => import('../core/company/index/company.component')
      }
    ]
  },
];
export default mainLayoutRoutes;
