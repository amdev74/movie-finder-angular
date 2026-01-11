import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoviesService, MovieDTO } from '../../core/api';
import { MovieFormComponent } from './movie-form.component';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, MovieFormComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header avec titre et bouton -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Movies</h1>
            <button 
            (click)="openCreateForm()"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
          <span class="text-lg">+</span>
          Create movie
        </button>
      </div>

      <!-- Loading state -->
      <div *ngIf="loading" class="card text-center py-8">
        <p class="text-gray-500">Loading movies...</p>
      </div>

      <!-- Error state -->
      <div *ngIf="error" class="card bg-red-50 border border-red-200">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <!-- Table -->
      <div *ngIf="!loading && !error" class="card overflow-hidden p-0">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Genre
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Publication Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actors
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let movie of movies" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-gray-900">{{ movie.name }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      [ngClass]="getGenreClass(movie.genre)">
                  {{ movie.genre }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ movie.publicationDate }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                <span *ngFor="let actor of movie.actors; let last = last">
                  {{ actor.firstname }} {{ actor.lastname }}<span *ngIf="!last">, </span>
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <button 
                  (click)="openEditForm(movie)"
                  class="text-primary-600 hover:text-primary-800 font-medium mr-3"
                >
                  Edit
                </button>
                <button 
                  (click)="deleteMovie(movie)"
                  class="text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>

            <!-- Empty state -->
            <tr *ngIf="movies.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                No movies found. Create your first movie!
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Movie Form Modal -->
    <app-movie-form
      *ngIf="showForm"
      [movie]="selectedMovie"
      (save)="onSaveMovie($event)"
      (cancel)="closeForm()"
    />
  `
})
export class MoviesComponent implements OnInit {
  private moviesService = inject(MoviesService);

  movies: MovieDTO[] = [];
  loading = true;
  error: string | null = null;
  
  // Form state
  showForm = false;
  selectedMovie?: MovieDTO;

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading = true;
    this.error = null;

    this.moviesService.searchMovies().subscribe({
      next: (movies) => {
        this.movies = movies;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load movies. Please try again.';
        this.loading = false;
        console.error('Error loading movies:', err);
      }
    });
  }

  openCreateForm(): void {
    this.selectedMovie = undefined;
    this.showForm = true;
  }

  openEditForm(movie: MovieDTO): void {
    this.selectedMovie = { ...movie };
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedMovie = undefined;
  }

  onSaveMovie(movie: MovieDTO): void {
    if (movie.id) {
      // Update existing movie
      this.moviesService.updateMovie(movie.id, movie).subscribe({
        next: () => {
          this.closeForm();
          this.loadMovies();
        },
        error: (err) => {
          console.error('Error updating movie:', err);
          this.error = 'Failed to update movie. Please try again.';
        }
      });
    } else {
      // Create new movie
      this.moviesService.createMovie(movie).subscribe({
        next: () => {
          this.closeForm();
          this.loadMovies();
        },
        error: (err) => {
          console.error('Error creating movie:', err);
          this.error = 'Failed to create movie. Please try again.';
        }
      });
    }
  }

  deleteMovie(movie: MovieDTO): void {
    if (!movie.id) return;
    
    if (confirm(`Are you sure you want to delete "${movie.name}"?`)) {
      this.moviesService.deleteMovie(movie.id).subscribe({
        next: () => {
          this.loadMovies();
        },
        error: (err) => {
          console.error('Error deleting movie:', err);
          this.error = 'Failed to delete movie. Please try again.';
        }
      });
    }
  }

  getGenreClass(genre: string | undefined): string {
    const classes: Record<string, string> = {
      'ACTION': 'bg-red-100 text-red-800',
      'COMEDY': 'bg-yellow-100 text-yellow-800',
      'DRAMA': 'bg-purple-100 text-purple-800',
      'HORROR': 'bg-gray-100 text-gray-800',
      'ROMANCE': 'bg-pink-100 text-pink-800',
      'SF': 'bg-blue-100 text-blue-800',
      'THRILLER': 'bg-orange-100 text-orange-800',
      'ANIMATION': 'bg-green-100 text-green-800',
      'DOCUMENTARY': 'bg-teal-100 text-teal-800'
    };
    return genre ? classes[genre] || 'bg-gray-100 text-gray-800' : 'bg-gray-100 text-gray-800';
  }
}