import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard) },
  { path: 'recrutamento', loadComponent: () => import('./pages/characters/characters').then(m => m.Characters) },
  { path: 'register', redirectTo: 'recrutamento', pathMatch: 'full' },
  { path: 'characters', redirectTo: 'recrutamento', pathMatch: 'full' },
  { path: 'sessao/:id', loadComponent: () => import('./pages/room-view/room-view').then(m => m.RoomView) },
  { path: 'room/:id', redirectTo: 'sessao/:id', pathMatch: 'full' },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
