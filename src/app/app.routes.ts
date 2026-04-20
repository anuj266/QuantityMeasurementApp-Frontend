import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./pages/auth/auth.component').then(m => m.AuthComponent)
  },
  {
    path: 'auth/callback',
    // Handles Google OAuth redirect with tokens
    loadComponent: () =>
      import('./pages/auth/oauth-callback.component').then(m => m.OAuthCallbackComponent)
  },
  {
    path: 'home',
    // Public - accessible without login
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'history',
    // Protected - login required
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/history/history.component').then(m => m.HistoryComponent)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
