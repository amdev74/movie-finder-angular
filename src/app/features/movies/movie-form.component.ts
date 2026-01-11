import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MovieDTO, ActorDTO } from '../../core/api';

function dateRange(minYear: number, maxYear: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;  // Laisse required gérer le cas vide
    
    const date = new Date(control.value);
    const year = date.getFullYear();
    
    if (year < minYear) {
      return { dateMin: { required: minYear, actual: year } };
    }
    if (year > maxYear) {
      return { dateMax: { required: maxYear, actual: year } };
    }
    return null;
  };
}

@Component({
  selector: 'app-movie-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl:'movie-form.component.html'
})
export class MovieFormComponent implements OnInit {
  private currentYear = new Date().getFullYear();

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
      name: [this.movie?.name || '', [Validators.required, Validators.minLength(2)]],
      genre: [this.movie?.genre || '', [Validators.required]],
      publicationDate: [this.movie?.publicationDate || '', [Validators.required, dateRange(1850, this.currentYear + 5)]],
      actors: this.fb.array(
        this.movie?.actors?.map(actor => this.createActorGroup(actor)) || [],
        [Validators.required, Validators.minLength(1)]
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