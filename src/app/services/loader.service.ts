// src/app/services/loader.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private loaderSubject = new BehaviorSubject<'global' | 'local' | null>(null); // Keeps track of which loader is visible
  loader$ = this.loaderSubject.asObservable(); // Observable to bind the loader in the template

  // Show loader of a specific type (global or local)
  show(type: 'global' | 'local') {
    this.loaderSubject.next(type);
  }

  // Hide all loaders
  hide() {
    this.loaderSubject.next(null);
  }
}
