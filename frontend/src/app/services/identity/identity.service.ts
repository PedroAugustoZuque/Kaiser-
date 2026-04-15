import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {
  private readonly STORAGE_KEY = 'ordo_display_name';
  private displayNameSubject = new BehaviorSubject<string | null>(localStorage.getItem(this.STORAGE_KEY));
  
  displayName$ = this.displayNameSubject.asObservable();

  setDisplayName(name: string) {
    localStorage.setItem(this.STORAGE_KEY, name);
    this.displayNameSubject.next(name);
  }

  getDisplayName(): string | null {
    return this.displayNameSubject.value;
  }

  clearIdentity() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.displayNameSubject.next(null);
  }
}
