import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IdentityService } from '../../services/identity/identity.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  isLogin = true;
  loading = false;
  errorMessage = '';

  credentials = {
    username: '',
    password: '',
    rememberMe: true
  };

  constructor(
    private identityService: IdentityService,
    private router: Router
  ) {}

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.errorMessage = '';
  }

  onSubmit() {
    if (!this.credentials.username || !this.credentials.password) return;
    
    this.loading = true;
    this.errorMessage = '';

    if (this.isLogin) {
      this.identityService.login(this.credentials).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.error || 'Falha na autenticação';
        }
      });
    } else {
      this.identityService.register(this.credentials).subscribe({
        next: () => {
          this.isLogin = true;
          this.loading = false;
          alert('Registro concluído. Você já pode acessar o sistema.');
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.error || 'Erro ao registrar agente';
        }
      });
    }
  }
}
