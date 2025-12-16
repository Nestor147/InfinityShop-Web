import { Routes } from '@angular/router';
import { authCanMatch } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: 'auth', loadChildren: () => import('./features/auth/auth.routes') },
    {
        path: '',
        canMatch: [authCanMatch],
        loadChildren: () => import('./features/main-layout/main-layout.routes')
    },
    { path: '**', redirectTo: '' },
];