import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { HeroList } from './components/hero-list/hero-list';
import { HeroEdit } from './components/hero-edit/hero-edit';
import { WeaponList } from './components/weapon-list/weapon-list';
import { WeaponEdit } from './components/weapon-edit/weapon-edit';
import { Fight } from './components/fight/fight';
import { Login } from './components/login/login';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login },

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },

  { path: 'heroes', component: HeroList, canActivate: [authGuard] },
  { path: 'heroes/new', component: HeroEdit, canActivate: [authGuard] },
  { path: 'heroes/:id', component: HeroEdit, canActivate: [authGuard] },

  { path: 'weapons', component: WeaponList, canActivate: [authGuard] },
  { path: 'weapons/new', component: WeaponEdit, canActivate: [authGuard] },
  { path: 'weapons/:id', component: WeaponEdit, canActivate: [authGuard] },

  { path: 'fight', component: Fight, canActivate: [authGuard] },

  { path: '**', redirectTo: '/dashboard' }
];