import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStatus } from '../../auth/interfaces';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {


  private authService = inject(AuthService);
  private router = inject(Router);


  public isAuthenticated = computed<boolean>(() => {
    return this.authService.authStatus() === AuthStatus.authenticated;
  });

  navigateBasedOnAuthStatus() {
    if (this.isAuthenticated()) {
      this.router.navigateByUrl('/dashboard');
    } else {
      this.router.navigateByUrl('/auth/login');
    }
  }

  onLogout() {
    this.router.navigateByUrl('/home');
    this.authService.logout();

  }

   goToHome() {
    this.router.navigateByUrl('/home');
  }

}
