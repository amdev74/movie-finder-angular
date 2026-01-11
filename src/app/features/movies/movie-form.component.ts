import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MovieDTO, ActorDTO } from '../../core/api';

@Component({
  selector: 'app-movie-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- Modal Backdrop -->
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
         (click)="onCancel()">
      
      <!-- Modal Content -->
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
           (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ movie ? 'Edit Movie' : 'Create Movie' }}
          </h2>
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="px-6 py-4 space-y-4">
          
          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              id="name"
              type="text"
              formControlName="name"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              [class.border-red-500]="form.get('name')?.invalid && form.get('name')?.touched"
              placeholder="Enter movie name"
            />
            <p *ngIf="form.get('name')?.invalid && form.get('name')?.touched" 
               class="mt-1 text-sm text-red-600">
              Name is required
            </p>
          </div>

          <!-- Genre -->
          <div>
            <label for="genre" class="block text-sm font-medium text-gray-700 mb-1">
              Genre *
            </label>
            <select
              id="genre"
              formControlName="genre"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              [class.border-red-500]="form.get('genre')?.invalid && form.get('genre')?.touched"
            >
              <option value="">Select a genre</option>
              <option *ngFor="let genre of genres" [value]="genre.value">
                {{ genre.label }}
              </option>
            </select>
            <p *ngIf="form.get('genre')?.invalid && form.get('genre')?.touched" 
               class="mt-1 text-sm text-red-600">
              Genre is required
            </p>
          </div>

          <!-- Publication Date -->
          <div>
            <label for="publicationDate" class="block text-sm font-medium text-gray-700 mb-1">
              Publication Date *
            </label>
            <input
              id="publicationDate"
              type="date"
              formControlName="publicationDate"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              [class.border-red-500]="form.get('publicationDate')?.invalid && form.get('publicationDate')?.touched"
            />
            <p *ngIf="form.get('publicationDate')?.invalid && form.get('publicationDate')?.touched" 
               class="mt-1 text-sm text-red-600">
              Publication date is required
            </p>
          </div>

          <!-- Actors -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-medium text-gray-700">
                Actors
              </label>
              <button
                type="button"
                (click)="addActor()"
                class="text-sm text-primary-600 hover:text-primary-800 font-medium"
              >
                + Add Actor
              </button>
            </div>
            
            <div formArrayName="actors" class="space-y-3">
              <div *ngFor="let actor of actorsArray.controls; let i = index"
                   [formGroupIndex]="i"
                   class="flex gap-3 items-start">
                <div class="flex-1">
                  <input
                    type="text"
                    [formControl]="getActorControl(i, 'firstname')"
                    placeholder="First name"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  />
                </div>
                <div class="flex-1">
                  <input
                    type="text"
                    [formControl]="getActorControl(i, 'lastname')"
                    placeholder="Last name"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  />
                </div>
                <button
                  type="button"
                  (click)="removeActor(i)"
                  class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove actor"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <p *ngIf="actorsArray.length === 0" class="text-sm text-gray-500 mt-2">
              No actors added yet
            </p>
          </div>

        </form>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            (click)="onCancel()"
            class="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            (click)="onSubmit()"
            [disabled]="form.invalid || submitting"
            class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ submitting ? 'Saving...' : (movie ? 'Update' : 'Create') }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class MovieFormComponent implements OnInit {
  @Input() movie?: MovieDTO;
  @Output() save = new EventEmitter<MovieDTO>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  submitting = false;

  genres = [
    { value: 'ACTION', label: 'Action' },
    { value: 'COMEDY', label: 'Comedy' },
    { value: 'DRAMA', label: 'Drama' },
    { value: 'HORROR', label: 'Horror' },
    { value: 'ROMANCE', label: 'Romance' },
    { value: 'SF', label: 'Science Fiction' },
    { value: 'THRILLER', label: 'Thriller' },
    { value: 'ANIMATION', label: 'Animation' },
    { value: 'DOCUMENTARY', label: 'Documentary' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: [this.movie?.name || '', Validators.required],
      genre: [this.movie?.genre || '', Validators.required],
      publicationDate: [this.movie?.publicationDate || '', Validators.required],
      actors: this.fb.array(
        this.movie?.actors?.map(actor => this.createActorGroup(actor)) || []
      )
    });
  }

  private createActorGroup(actor?: ActorDTO): FormGroup {
    return this.fb.group({
      firstname: [actor?.firstname || ''],
      lastname: [actor?.lastname || '']
    });
  }

  get actorsArray(): FormArray {
    return this.form.get('actors') as FormArray;
  }

  getActorControl(index: number, field: string) {
    return (this.actorsArray.at(index) as FormGroup).get(field)!;
  }

  addActor(): void {
    this.actorsArray.push(this.createActorGroup());
  }

  removeActor(index: number): void {
    this.actorsArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const movieData: MovieDTO = {
      ...this.movie,
      ...this.form.value
    };
    this.save.emit(movieData);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}