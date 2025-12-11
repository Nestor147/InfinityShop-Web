import { Routes } from '@angular/router';
import MainLayoutComponent from './pages/main-layout/main-layout';

const mainLayoutRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '' },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', 
        loadComponent: () => import('./pages/main-dashboard/main-dashboard') 
      },

    ]
  },
];
export default mainLayoutRoutes;
