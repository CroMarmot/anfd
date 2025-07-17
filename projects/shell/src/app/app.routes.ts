import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';
import { Home } from './home/home';

export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' },
  {
    path: 'products',
    loadComponent: () =>
        loadRemoteModule('products', './Component').then((m) => m.App),
  },
  {
      path: '**',
      component: Home,
  }
];
