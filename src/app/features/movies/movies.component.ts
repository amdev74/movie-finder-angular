import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoviesService, MovieDTO } from '../../core/api';
import { MovieFormComponent } from './movie-form.component';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, MovieFormComponent],
  templateUrl: 'movies.component.html'
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