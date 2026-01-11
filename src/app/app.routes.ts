import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { MoviesComponent } from './features/movies/movies.component';

/**
 * Application routes configuration
 * Defines all navigable routes in the application
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    title: 'Home - MovieDB'
  },
  {
    path: 'movies',
    component: MoviesComponent,
    title: 'Movies - MovieDB'
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];