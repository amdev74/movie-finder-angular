import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideClapperboard, lucideStar, lucideSearch } from '@ng-icons/lucide';

/**
 * Home page component
 * Displays welcome message and quick access to main features
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIconComponent],
  viewProviders: [provideIcons({ lucideClapperboard, lucideStar, lucideSearch })],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <!-- Hero Section -->
        <div class="text-center">
          <h1 class="text-5xl font-extrabold text-gray-900 sm:text-6xl md:text-7xl">
            Welcome to 
            <span class="text-primary-600">MovieDB</span>
          </h1>
          <p class="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Your ultimate destination for discovering, managing, and exploring 
            your favorite movies and actors.
          </p>
          
          <!-- CTA Buttons -->
          <div class="mt-10 flex justify-center gap-4">
            <a
              routerLink="/movies"
              class="btn-primary text-lg px-8 py-3"
            >
              Browse Movies
            </a>
            <button
              class="btn-secondary text-lg px-8 py-3"
            >
              Learn More
            </button>
          </div>
        </div>

        <!-- Features Grid -->
        <div class="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Feature 1 -->
          <div class="card hover:shadow-lg transition-shadow duration-200">
            <div class="text-primary-600 mb-4">
              <ng-icon name="lucideClapperboard" size="32"></ng-icon>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              Discover Movies
            </h3>
            <p class="text-gray-600">
              Browse through our extensive collection of movies across all genres
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="card hover:shadow-lg transition-shadow duration-200">
            <div class="text-primary-600 mb-4">
              <ng-icon name="lucideStar" size="32"></ng-icon>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              Track Actors
            </h3>
            <p class="text-gray-600">
              Follow your favorite actors and explore their filmography
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="card hover:shadow-lg transition-shadow duration-200">
            <div class="text-primary-600 mb-4">
              <ng-icon name="lucideSearch" size="32"></ng-icon>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              Advanced Search
            </h3>
            <p class="text-gray-600">
              Find exactly what you're looking for with powerful search filters
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {}