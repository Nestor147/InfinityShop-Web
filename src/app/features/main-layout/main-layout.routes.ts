import { Routes } from '@angular/router';
import MainLayoutComponent from './pages/main-layout/main-layout.component';

const mainLayoutRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', 
        loadComponent: () => import('./pages/main-dashboard/main-dashboard.component') 
      },
      // { path: 'atacado', 
      //   loadChildren: () => import('../atacado-roles/atacado-roles.routes') 
      // },
      // { path: 'applications', 
      //   loadChildren: () => import('../applications/applications.routes') 
      // },
      // { path: 'managment-roles', 
      //   loadChildren: () => import('../roles/roles.routes') 
      // },
      // { path: 'menu',
      //   loadChildren: () => import('../menu/menu.routes')
      // },
      // { path: 'points',
      //   loadChildren: () => import('../points/points.routes')
      // },
      // { path: 'assing-pages-roles',
      //   loadChildren: () => import('../assing-pages-roles/assing-pages-roles.routes')
      // },
      // { path: 'assing-roles',
      //   loadChildren: () => import('../assing-roles/assing-roles.routes')
      // },
      // { path: 'reports',
      //   loadChildren: () => import('../reports/report.routes')
      // },
    ]
  },
];
export default mainLayoutRoutes;
