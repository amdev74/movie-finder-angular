# Cours Angular - Comprendre les Components et les Formulaires

Ce cours est basé sur ton projet **movie-finder-angular**. On va décortiquer chaque concept.

---

## Table des matières

1. [Structure d'un Component](#1-structure-dun-component)
2. [Le cycle de vie et le rendu](#2-le-cycle-de-vie-et-le-rendu)
3. [Le Data Binding](#3-le-data-binding)
4. [Les Directives Structurelles](#4-les-directives-structurelles)
5. [La Communication entre Components](#5-la-communication-entre-components)
6. [Les Formulaires Réactifs](#6-les-formulaires-réactifs)
7. [Les Services et l'Injection de Dépendances](#7-les-services-et-linjection-de-dépendances)

---

## 1. Structure d'un Component

Un component Angular est une **classe TypeScript** décorée avec `@Component`. C'est la brique de base de toute application Angular.

### Anatomie complète

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  // === MÉTADONNÉES ===
  
  selector: 'app-movies',        // Balise HTML pour utiliser ce component
  standalone: true,              // Component autonome (Angular 14+)
  imports: [CommonModule],       // Modules/Components importés
  
  // === TEMPLATE (2 options) ===
  
  template: `                    // Option 1: Template inline
    <h1>{{ title }}</h1>
  `,
  // templateUrl: './movies.component.html',  // Option 2: Fichier externe
  
  // === STYLES (2 options) ===
  
  styles: [`                     // Option 1: Styles inline
    h1 { color: blue; }
  `],
  // styleUrls: ['./movies.component.css'],   // Option 2: Fichier externe
})
export class MoviesComponent implements OnInit {
  // === PROPRIÉTÉS (État du component) ===
  title = 'Movies';
  movies: Movie[] = [];
  loading = false;
  
  // === CONSTRUCTEUR (Injection de dépendances) ===
  constructor(private moviesService: MoviesService) {}
  
  // === CYCLE DE VIE ===
  ngOnInit(): void {
    // Appelé après la création du component
    this.loadMovies();
  }
  
  // === MÉTHODES ===
  loadMovies(): void {
    this.loading = true;
    // ...
  }
}
```

### Le décorateur @Component expliqué

| Propriété | Description | Exemple |
|-----------|-------------|---------|
| `selector` | Nom de la balise HTML | `'app-movies'` → `<app-movies />` |
| `standalone` | Component autonome sans NgModule | `true` |
| `imports` | Dépendances nécessaires | `[CommonModule, FormsModule]` |
| `template` | HTML du component | `'<h1>Hello</h1>'` |
| `styles` | CSS scopé au component | `['h1 { color: red }']` |

### Standalone vs NgModule

**Avant (NgModule)** - Angular < 14 :
```typescript
// movies.module.ts
@NgModule({
  declarations: [MoviesComponent],
  imports: [CommonModule],
  exports: [MoviesComponent]
})
export class MoviesModule {}
```

**Maintenant (Standalone)** - Angular 14+ :
```typescript
// movies.component.ts
@Component({
  standalone: true,
  imports: [CommonModule],  // Directement dans le component
  // ...
})
export class MoviesComponent {}
```

➡️ **Standalone est plus simple** : tout est dans un seul fichier.

---

## 2. Le cycle de vie et le rendu

### Comment Angular rend un component

```
1. Angular lit le selector 'app-movies'
              ↓
2. Il instancie la classe MoviesComponent
              ↓
3. Il appelle le constructeur (injection des services)
              ↓
4. Il appelle ngOnInit()
              ↓
5. Il compile le template et l'insère dans le DOM
              ↓
6. Il surveille les changements (Change Detection)
              ↓
7. À chaque changement → re-render du template
```

### Les hooks du cycle de vie

```typescript
export class MoviesComponent implements OnInit, OnDestroy, OnChanges {
  
  // 1. CONSTRUCTOR - Injection des dépendances
  constructor(private service: MoviesService) {
    console.log('1. Constructor');
  }
  
  // 2. ngOnChanges - Quand un @Input change
  ngOnChanges(changes: SimpleChanges): void {
    console.log('2. Input changed:', changes);
  }
  
  // 3. ngOnInit - Initialisation (appelé UNE fois)
  ngOnInit(): void {
    console.log('3. Component initialized');
    this.loadData();  // ← C'est ici qu'on charge les données
  }
  
  // 4. ngDoCheck - À chaque cycle de détection
  ngDoCheck(): void {
    console.log('4. Change detection');
  }
  
  // 5. ngOnDestroy - Nettoyage avant destruction
  ngOnDestroy(): void {
    console.log('5. Component destroyed');
    this.subscription.unsubscribe();  // ← Éviter les memory leaks
  }
}
```

### Quand utiliser quoi ?

| Hook | Utilisation |
|------|-------------|
| `constructor` | Injection uniquement, **pas de logique** |
| `ngOnInit` | Charger les données, initialiser le state |
| `ngOnChanges` | Réagir aux changements d'@Input |
| `ngOnDestroy` | Se désabonner, nettoyer les timers |

---

## 3. Le Data Binding

Le Data Binding connecte le **TypeScript** (logique) au **Template** (vue).

### Les 4 types de binding

```typescript
@Component({
  template: `
    <!-- 1. INTERPOLATION {{ }} - TS → HTML (lecture) -->
    <h1>{{ title }}</h1>
    <p>{{ getFullName() }}</p>
    <p>{{ movies.length }} films</p>
    
    <!-- 2. PROPERTY BINDING [ ] - TS → Attribut HTML -->
    <input [value]="searchTerm" />
    <button [disabled]="loading">Save</button>
    <img [src]="movie.poster" />
    <div [class.active]="isActive"></div>
    <div [style.color]="textColor"></div>
    
    <!-- 3. EVENT BINDING ( ) - HTML → TS -->
    <button (click)="save()">Save</button>
    <input (input)="onSearch($event)" />
    <form (submit)="onSubmit()">
    <div (mouseenter)="onHover()">
    
    <!-- 4. TWO-WAY BINDING [( )] - TS ↔ HTML -->
    <input [(ngModel)]="searchTerm" />
    <!-- Équivalent à : -->
    <input [ngModel]="searchTerm" (ngModelChange)="searchTerm = $event" />
  `
})
export class MoviesComponent {
  title = 'Movies';
  searchTerm = '';
  loading = false;
  isActive = true;
  textColor = 'blue';
  
  getFullName(): string {
    return 'John Doe';
  }
  
  save(): void {
    console.log('Saved!');
  }
  
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    console.log(input.value);
  }
}
```

### Résumé visuel

```
┌─────────────────────────────────────────────────────┐
│                    COMPONENT                         │
│  ┌──────────────┐          ┌──────────────┐        │
│  │  TypeScript  │          │   Template   │        │
│  │              │          │              │        │
│  │  title = 'X' │ ──{{}}──→│ <h1>X</h1>   │        │
│  │              │ ──[ ]──→ │ [disabled]   │        │
│  │  onClick()   │ ←──( )── │ (click)      │        │
│  │  value = ''  │ ←─[()]─→ │ [(ngModel)]  │        │
│  └──────────────┘          └──────────────┘        │
└─────────────────────────────────────────────────────┘
```

---

## 4. Les Directives Structurelles

Les directives structurelles **modifient le DOM** (ajoutent/suppriment des éléments).

### *ngIf - Affichage conditionnel

```html
<!-- Afficher si loading est true -->
<div *ngIf="loading">
  Chargement en cours...
</div>

<!-- Avec else -->
<div *ngIf="loading; else content">
  Chargement...
</div>
<ng-template #content>
  <p>Contenu chargé !</p>
</ng-template>

<!-- Avec then et else -->
<div *ngIf="movies.length > 0; then movieList; else empty"></div>
<ng-template #movieList>
  <p>{{ movies.length }} films trouvés</p>
</ng-template>
<ng-template #empty>
  <p>Aucun film</p>
</ng-template>
```

### *ngFor - Boucle sur une liste

```html
<!-- Boucle simple -->
<tr *ngFor="let movie of movies">
  <td>{{ movie.name }}</td>
</tr>

<!-- Avec index -->
<tr *ngFor="let movie of movies; let i = index">
  <td>{{ i + 1 }}. {{ movie.name }}</td>
</tr>

<!-- Avec toutes les variables disponibles -->
<tr *ngFor="let movie of movies; 
            let i = index;        // Position (0, 1, 2...)
            let first = first;    // true si premier élément
            let last = last;      // true si dernier élément
            let even = even;      // true si index pair
            let odd = odd">       // true si index impair
  <td [class.bg-gray-100]="even">
    {{ movie.name }}
    <span *ngIf="last">(dernier)</span>
  </td>
</tr>

<!-- Avec trackBy pour optimiser les performances -->
<tr *ngFor="let movie of movies; trackBy: trackByMovieId">
  <td>{{ movie.name }}</td>
</tr>
```

```typescript
// Dans le component
trackByMovieId(index: number, movie: MovieDTO): number {
  return movie.id!;  // Angular réutilise les éléments DOM si l'ID ne change pas
}
```

### *ngSwitch - Conditions multiples

```html
<div [ngSwitch]="movie.genre">
  <span *ngSwitchCase="'ACTION'" class="bg-red-100">Action</span>
  <span *ngSwitchCase="'COMEDY'" class="bg-yellow-100">Comedy</span>
  <span *ngSwitchCase="'DRAMA'" class="bg-purple-100">Drama</span>
  <span *ngSwitchDefault class="bg-gray-100">Other</span>
</div>
```

### Application dans ton projet : Le tableau des films

```html
<!-- Structure complète du tableau -->
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Genre</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <!-- Boucle sur chaque film -->
    <tr *ngFor="let movie of movies" class="hover:bg-gray-50">
      
      <!-- Colonne Name -->
      <td>{{ movie.name }}</td>
      
      <!-- Colonne Genre avec style dynamique -->
      <td>
        <span [ngClass]="getGenreClass(movie.genre)">
          {{ movie.genre }}
        </span>
      </td>
      
      <!-- Colonne Actors avec boucle imbriquée -->
      <td>
        <span *ngFor="let actor of movie.actors; let last = last">
          {{ actor.firstname }} {{ actor.lastname }}
          <span *ngIf="!last">, </span>  <!-- Virgule sauf pour le dernier -->
        </span>
      </td>
      
      <!-- Colonne Actions -->
      <td>
        <button (click)="openEditForm(movie)">Edit</button>
        <button (click)="deleteMovie(movie)">Delete</button>
      </td>
    </tr>
    
    <!-- État vide -->
    <tr *ngIf="movies.length === 0">
      <td colspan="4">No movies found</td>
    </tr>
  </tbody>
</table>
```

### [ngClass] - Classes CSS dynamiques

```html
<!-- Objet : clé = classe, valeur = condition -->
<span [ngClass]="{
  'bg-red-100': movie.genre === 'ACTION',
  'bg-blue-100': movie.genre === 'SF',
  'font-bold': movie.isFeatured
}">
  {{ movie.genre }}
</span>

<!-- Ou via une méthode -->
<span [ngClass]="getGenreClass(movie.genre)">
  {{ movie.genre }}
</span>
```

```typescript
getGenreClass(genre: string | undefined): string {
  const classes: Record<string, string> = {
    'ACTION': 'bg-red-100 text-red-800',
    'COMEDY': 'bg-yellow-100 text-yellow-800',
    'DRAMA': 'bg-purple-100 text-purple-800',
  };
  return genre ? classes[genre] || 'bg-gray-100' : 'bg-gray-100';
}
```

---

## 5. La Communication entre Components

### @Input() - Parent → Enfant

Le parent envoie des données à l'enfant.

```typescript
// movie-form.component.ts (ENFANT)
@Component({
  selector: 'app-movie-form',
  template: `
    <h2>{{ movie ? 'Edit' : 'Create' }} Movie</h2>
    <input [value]="movie?.name" />
  `
})
export class MovieFormComponent {
  @Input() movie?: MovieDTO;  // Reçoit le film du parent
}
```

```html
<!-- movies.component.ts (PARENT) -->
<app-movie-form [movie]="selectedMovie" />
```

```
┌─────────────────────────────────────┐
│  PARENT (MoviesComponent)           │
│                                     │
│  selectedMovie = { name: 'Matrix' } │
│           │                         │
│           │ [movie]="selectedMovie" │
│           ▼                         │
│  ┌─────────────────────────────┐   │
│  │  ENFANT (MovieFormComponent) │   │
│  │                              │   │
│  │  @Input() movie ◄────────────│   │
│  │  // movie = { name: 'Matrix'}│   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### @Output() - Enfant → Parent

L'enfant notifie le parent via un EventEmitter.

```typescript
// movie-form.component.ts (ENFANT)
@Component({
  selector: 'app-movie-form',
  template: `
    <form (submit)="onSubmit()">
      <!-- ... -->
      <button type="button" (click)="onCancel()">Cancel</button>
      <button type="submit">Save</button>
    </form>
  `
})
export class MovieFormComponent {
  @Input() movie?: MovieDTO;
  
  @Output() save = new EventEmitter<MovieDTO>();    // Événement "save"
  @Output() cancel = new EventEmitter<void>();      // Événement "cancel"
  
  onSubmit(): void {
    const movieData: MovieDTO = { /* ... */ };
    this.save.emit(movieData);  // Envoie l'événement au parent
  }
  
  onCancel(): void {
    this.cancel.emit();  // Envoie l'événement au parent
  }
}
```

```html
<!-- movies.component.ts (PARENT) -->
<app-movie-form 
  [movie]="selectedMovie"
  (save)="onSaveMovie($event)"
  (cancel)="closeForm()"
/>
```

```typescript
// movies.component.ts (PARENT)
export class MoviesComponent {
  selectedMovie?: MovieDTO;
  showForm = false;
  
  onSaveMovie(movie: MovieDTO): void {
    console.log('Film reçu:', movie);
    // Appeler l'API pour sauvegarder
  }
  
  closeForm(): void {
    this.showForm = false;
  }
}
```

```
┌─────────────────────────────────────┐
│  PARENT (MoviesComponent)           │
│                                     │
│  onSaveMovie(movie) ◄───────────────│
│           ▲                         │
│           │ (save)="onSaveMovie($event)"
│           │                         │
│  ┌─────────────────────────────┐   │
│  │  ENFANT (MovieFormComponent) │   │
│  │                              │   │
│  │  @Output() save ─────────────│───│
│  │  this.save.emit(movieData)   │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Résumé de la communication

```
              @Input()
    Parent ──────────────→ Enfant
              [property]
              
              @Output()
    Parent ←────────────── Enfant
              (event)
```

---

## 6. Les Formulaires Réactifs

Angular propose 2 approches pour les formulaires :
- **Template-driven** : Logique dans le HTML (simple mais limité)
- **Reactive Forms** : Logique dans le TypeScript (puissant et testable)

### Structure d'un Reactive Form

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-movie-form',
  standalone: true,
  imports: [ReactiveFormsModule],  // IMPORTANT: Importer ReactiveFormsModule
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <!-- Champs ici -->
    </form>
  `
})
export class MovieFormComponent implements OnInit {
  form!: FormGroup;  // Le formulaire
  
  constructor(private fb: FormBuilder) {}  // Injection du FormBuilder
  
  ngOnInit(): void {
    this.initForm();
  }
  
  private initForm(): void {
    this.form = this.fb.group({
      // Structure du formulaire
    });
  }
}
```

### Créer le FormGroup

```typescript
private initForm(): void {
  this.form = this.fb.group({
    
    // Champ simple avec valeur par défaut
    name: [''],
    
    // Champ avec valeur initiale depuis @Input
    name: [this.movie?.name || ''],
    
    // Champ avec validation
    name: ['', Validators.required],
    
    // Champ avec plusieurs validations
    name: ['', [Validators.required, Validators.minLength(2)]],
    
    // Champ avec validation asynchrone
    email: ['', [Validators.required, Validators.email]],
    
    // Select / Dropdown
    genre: [this.movie?.genre || '', Validators.required],
    
    // Date
    publicationDate: [this.movie?.publicationDate || '', Validators.required],
    
    // FormArray pour les listes dynamiques (acteurs)
    actors: this.fb.array([])
  });
}
```

### Les Validators disponibles

```typescript
import { Validators } from '@angular/forms';

this.fb.group({
  // Champ obligatoire
  name: ['', Validators.required],
  
  // Longueur minimum/maximum
  name: ['', [Validators.minLength(2), Validators.maxLength(100)]],
  
  // Email valide
  email: ['', Validators.email],
  
  // Pattern regex
  phone: ['', Validators.pattern(/^[0-9]{10}$/)],
  
  // Valeur min/max (pour les nombres)
  age: [18, [Validators.min(0), Validators.max(120)]],
  
  // Validator personnalisé
  password: ['', [Validators.required, this.passwordStrengthValidator]],
});

// Validator personnalisé
passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;
  
  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumeric = /[0-9]/.test(value);
  
  const valid = hasUpperCase && hasLowerCase && hasNumeric;
  return valid ? null : { passwordStrength: true };
}
```

### Lier le formulaire au template

```html
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  
  <!-- Champ texte simple -->
  <div>
    <label for="name">Name *</label>
    <input 
      id="name"
      type="text"
      formControlName="name"
      class="input"
      [class.border-red-500]="form.get('name')?.invalid && form.get('name')?.touched"
    />
    <!-- Message d'erreur -->
    <p *ngIf="form.get('name')?.invalid && form.get('name')?.touched" 
       class="text-red-600">
      Name is required
    </p>
  </div>
  
  <!-- Select / Dropdown -->
  <div>
    <label for="genre">Genre *</label>
    <select id="genre" formControlName="genre">
      <option value="">Select a genre</option>
      <option *ngFor="let genre of genres" [value]="genre.value">
        {{ genre.label }}
      </option>
    </select>
  </div>
  
  <!-- Date -->
  <div>
    <label for="date">Publication Date *</label>
    <input id="date" type="date" formControlName="publicationDate" />
  </div>
  
  <!-- Boutons -->
  <button type="button" (click)="onCancel()">Cancel</button>
  <button type="submit" [disabled]="form.invalid">Save</button>
  
</form>
```

### FormArray - Listes dynamiques (les acteurs)

```typescript
export class MovieFormComponent {
  form!: FormGroup;
  
  // Getter pour accéder facilement au FormArray
  get actorsArray(): FormArray {
    return this.form.get('actors') as FormArray;
  }
  
  private initForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      genre: ['', Validators.required],
      // Initialiser avec les acteurs existants ou un tableau vide
      actors: this.fb.array(
        this.movie?.actors?.map(actor => this.createActorGroup(actor)) || []
      )
    });
  }
  
  // Créer un FormGroup pour un acteur
  private createActorGroup(actor?: ActorDTO): FormGroup {
    return this.fb.group({
      firstname: [actor?.firstname || ''],
      lastname: [actor?.lastname || '']
    });
  }
  
  // Ajouter un acteur
  addActor(): void {
    this.actorsArray.push(this.createActorGroup());
  }
  
  // Supprimer un acteur
  removeActor(index: number): void {
    this.actorsArray.removeAt(index);
  }
  
  // Accéder à un contrôle spécifique d'un acteur
  getActorControl(index: number, field: string) {
    return (this.actorsArray.at(index) as FormGroup).get(field)!;
  }
}
```

```html
<!-- Template pour les acteurs -->
<div>
  <div class="flex justify-between">
    <label>Actors</label>
    <button type="button" (click)="addActor()">+ Add Actor</button>
  </div>
  
  <!-- Boucle sur le FormArray -->
  <div formArrayName="actors">
    <div *ngFor="let actor of actorsArray.controls; let i = index" 
         class="flex gap-2">
      
      <!-- Chaque acteur a son propre FormGroup -->
      <ng-container [formGroupName]="i">
        <input formControlName="firstname" placeholder="First name" />
        <input formControlName="lastname" placeholder="Last name" />
        <button type="button" (click)="removeActor(i)">✕</button>
      </ng-container>
      
    </div>
  </div>
  
  <p *ngIf="actorsArray.length === 0">No actors added</p>
</div>
```

### Soumettre le formulaire

```typescript
onSubmit(): void {
  // 1. Vérifier la validité
  if (this.form.invalid) {
    // Marquer tous les champs comme "touched" pour afficher les erreurs
    this.form.markAllAsTouched();
    return;
  }
  
  // 2. Récupérer les valeurs
  const formValues = this.form.value;
  // formValues = { name: 'Matrix', genre: 'SF', actors: [...] }
  
  // 3. Créer l'objet à envoyer
  const movieData: MovieDTO = {
    ...this.movie,      // Garder l'ID si c'est une édition
    ...formValues       // Écraser avec les nouvelles valeurs
  };
  
  // 4. Émettre vers le parent
  this.save.emit(movieData);
}
```

### Schéma récapitulatif

```
┌──────────────────────────────────────────────────────────────┐
│                        REACTIVE FORM                          │
│                                                               │
│  FormGroup (form)                                             │
│  ├── FormControl (name)          ←→  <input formControlName>  │
│  ├── FormControl (genre)         ←→  <select formControlName> │
│  ├── FormControl (publicationDate)                            │
│  └── FormArray (actors)          ←→  <div formArrayName>      │
│       ├── FormGroup [0]          ←→  <div [formGroupName]="0">│
│       │    ├── FormControl (firstname)                        │
│       │    └── FormControl (lastname)                         │
│       └── FormGroup [1]                                       │
│            ├── FormControl (firstname)                        │
│            └── FormControl (lastname)                         │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 7. Les Services et l'Injection de Dépendances

### Qu'est-ce qu'un Service ?

Un service est une classe qui contient la **logique métier** et les **appels API**. Il est partagé entre plusieurs components.

```typescript
// movies.service.ts (généré par OpenAPI)
@Injectable({
  providedIn: 'root'  // Disponible dans toute l'app (singleton)
})
export class MoviesService {
  
  constructor(private http: HttpClient) {}
  
  searchMovies(): Observable<MovieDTO[]> {
    return this.http.get<MovieDTO[]>('/api/movies');
  }
  
  createMovie(movie: MovieDTO): Observable<MovieDTO> {
    return this.http.post<MovieDTO>('/api/movies', movie);
  }
  
  updateMovie(id: number, movie: MovieDTO): Observable<MovieDTO> {
    return this.http.put<MovieDTO>(`/api/movies/${id}`, movie);
  }
  
  deleteMovie(id: number): Observable<void> {
    return this.http.delete<void>(`/api/movies/${id}`);
  }
}
```

### Injection dans un Component

```typescript
// Méthode moderne (Angular 14+)
export class MoviesComponent {
  private moviesService = inject(MoviesService);  // inject()
}

// Méthode classique (constructor)
export class MoviesComponent {
  constructor(private moviesService: MoviesService) {}
}
```

### Utiliser les Observables

```typescript
export class MoviesComponent implements OnInit {
  private moviesService = inject(MoviesService);
  
  movies: MovieDTO[] = [];
  loading = false;
  error: string | null = null;
  
  ngOnInit(): void {
    this.loadMovies();
  }
  
  loadMovies(): void {
    this.loading = true;
    this.error = null;
    
    this.moviesService.searchMovies().subscribe({
      // Succès
      next: (movies) => {
        this.movies = movies;
        this.loading = false;
      },
      // Erreur
      error: (err) => {
        this.error = 'Failed to load movies';
        this.loading = false;
        console.error(err);
      },
      // Terminé (optionnel)
      complete: () => {
        console.log('Request completed');
      }
    });
  }
  
  deleteMovie(movie: MovieDTO): void {
    if (!movie.id) return;
    
    // Confirmation
    if (!confirm(`Delete "${movie.name}"?`)) return;
    
    this.moviesService.deleteMovie(movie.id).subscribe({
      next: () => {
        this.loadMovies();  // Recharger la liste
      },
      error: (err) => {
        this.error = 'Failed to delete movie';
      }
    });
  }
}
```

### Schéma de flux complet

```
┌─────────────────────────────────────────────────────────────────┐
│                         APPLICATION                              │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   MoviesComponent                        │   │
│  │                                                          │   │
│  │  1. ngOnInit()                                           │   │
│  │       │                                                  │   │
│  │       ▼                                                  │   │
│  │  2. loadMovies()                                         │   │
│  │       │                                                  │   │
│  │       ▼                                                  │   │
│  │  3. moviesService.searchMovies().subscribe()             │   │
│  │       │                                                  │   │
│  └───────│──────────────────────────────────────────────────┘   │
│          │                                                       │
│          ▼                                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   MoviesService                          │   │
│  │                                                          │   │
│  │  4. http.get('/api/movies')                              │   │
│  │       │                                                  │   │
│  └───────│──────────────────────────────────────────────────┘   │
│          │                                                       │
│          ▼                                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                      API Backend                         │   │
│  │                                                          │   │
│  │  5. GET /api/movies → [{ id: 1, name: 'Matrix' }, ...]   │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│          │                                                       │
│          ▼ (Response)                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   MoviesComponent                        │   │
│  │                                                          │   │
│  │  6. next: (movies) => { this.movies = movies }           │   │
│  │       │                                                  │   │
│  │       ▼                                                  │   │
│  │  7. Template re-render avec *ngFor="let movie of movies" │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Résumé : Flux complet de ton application

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  1. L'utilisateur ouvre /movies                                  │
│     → Angular charge MoviesComponent                             │
│                                                                  │
│  2. ngOnInit() appelle loadMovies()                              │
│     → loading = true                                             │
│     → Template affiche "Loading..."                              │
│                                                                  │
│  3. moviesService.searchMovies() retourne les films              │
│     → movies = [...], loading = false                            │
│     → Template affiche le tableau avec *ngFor                    │
│                                                                  │
│  4. L'utilisateur clique sur "Create Movie"                      │
│     → openCreateForm()                                           │
│     → showForm = true                                            │
│     → Template affiche <app-movie-form>                          │
│                                                                  │
│  5. L'utilisateur remplit le formulaire                          │
│     → form.value se met à jour automatiquement                   │
│     → Validators vérifient les champs                            │
│                                                                  │
│  6. L'utilisateur clique sur "Save"                              │
│     → onSubmit() vérifie form.invalid                            │
│     → save.emit(movieData) envoie au parent                      │
│                                                                  │
│  7. MoviesComponent reçoit l'événement (save)                    │
│     → onSaveMovie() appelle moviesService.createMovie()          │
│     → Succès: closeForm() + loadMovies()                         │
│     → Le tableau se met à jour avec le nouveau film              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Commandes utiles

```bash
# Créer un nouveau component
ng generate component features/movies/movie-detail
# ou
ng g c features/movies/movie-detail

# Créer un service
ng generate service core/services/auth
# ou
ng g s core/services/auth

# Créer un module (si pas standalone)
ng g m features/movies

# Lancer l'app
ng serve

# Build production
ng build --configuration production
```

---

## Pour aller plus loin

- **Routing** : Navigation entre pages
- **Guards** : Protection des routes
- **Interceptors** : Modifier les requêtes HTTP (ajouter token, gérer erreurs)
- **Pipes** : Transformer les données dans le template (`| date`, `| currency`)
- **RxJS** : Opérateurs pour manipuler les Observables
- **State Management** : NgRx, Signals (Angular 16+)