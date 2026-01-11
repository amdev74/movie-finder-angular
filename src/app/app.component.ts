import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/layout/header/header.component';

/**
 * Root application component
 * Provides the main layout structure with header and router outlet
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <div class="min-h-screen flex flex-col">
      <app-header />
      <main class="flex-1">
        <router-outlet />
      </main>
      <footer class="bg-gray-800 text-white py-6 mt-auto">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p class="text-sm">
            © 2025 MovieDB - Built with Angular 21 & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  `
})
export class AppComponent {
  title = 'movie-finder-angular';
}