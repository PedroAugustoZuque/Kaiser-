import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IdentityService } from './services/identity/identity.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');
  clock = new Date();
  sidebarExpanded = false;

  private identityService = inject(IdentityService);
  private router = inject(Router);

  constructor() {
    setInterval(() => {
      this.clock = new Date();
    }, 1000);
  }

  logout() {
    this.identityService.logout();
    this.router.navigate(['/login']);
  }
}

