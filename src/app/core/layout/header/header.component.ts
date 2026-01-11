import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideFilm } from '@ng-icons/lucide';

/**
 * Header component with navigation menu
 * Displays application title and navigation links
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIconComponent],
  viewProviders: [provideIcons({ lucideFilm })],
  template: `
    <header class="bg-white shadow-sm">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <!-- Logo/Brand -->
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-2xl font-bold text-blue-600 flex items-center gap-2">
                <ng-icon name="lucideFilm" size="28"></ng-icon>
                MovieDB
              </h1>
            </div>
            
            <!-- Navigation Links -->
            <div class="hidden sm:ml-8 sm:flex sm:space-x-8">
              <a
                routerLink="/home"
                routerLinkActive="border-primary-500 text-gray-900"
                [routerLinkActiveOptions]="{ exact: true }"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 
                       inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                       transition-colors duration-200"
              >
                Home
              </a>
              <a
                routerLink="/movies"
                routerLinkActive="border-primary-500 text-gray-900"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 
                       inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                       transition-colors duration-200"
              >
                Movies
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  `
})
export class HeaderComponent {}