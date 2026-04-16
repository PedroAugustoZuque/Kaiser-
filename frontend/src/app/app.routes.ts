import { Routes } from '@angular/router';
import { authGuard } from './services/auth/auth.guard';

export const routes: Routes = [
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login').then(m => m.Login) 
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [authGuard]
  },
  { 
    path: 'recrutamento', 
    loadComponent: () => import('./pages/characters/characters').then(m => m.Characters),
    canActivate: [authGuard]
  },
  { 
    path: 'sessao/:id', 
    loadComponent: () => import('./pages/room-view/room-view').then(m => m.RoomView),
    canActivate: [authGuard]
  },
  { path: 'register', redirectTo: 'login', pathMatch: 'full' },
  { path: 'characters', redirectTo: 'recrutamento', pathMatch: 'full' },
  { path: 'room/:id', redirectTo: 'sessao/:id', pathMatch: 'full' },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];
