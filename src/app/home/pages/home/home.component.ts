import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { HomeServiceService } from '../../services/homeService.service';
import { AuthStatus } from '../../../auth/interfaces/auth-status.enum';
import { FormControl } from '@angular/forms';
import { debounceTime, filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  private authService = inject(AuthService);
  public user = computed(() => this.authService.currentUser());

  private homeService = inject(HomeServiceService);
  private router = inject(Router);

  chollos: any[] = []; // Array para almacenar los chollos
  searchChollos = new FormControl(''); // FormControl para manejar la entrada de búsqueda

  ngOnInit(): void {
    this.getAllChollos(); // Cargar todos los chollos al iniciar

     // Suscripción a los cambios en el FormControl searchChollos
    this.searchChollos.valueChanges.pipe(
      filter((titulo): titulo is string => titulo !== null),
      debounceTime(100),
      filter((titulo: string) => titulo.length >= 3),
      switchMap(titulo => this.homeService.getCholloByTitle(titulo))
    ).subscribe({
      next: (chollos) => {
        this.chollos = chollos; // Muestra solo el chollo encontrado
      },
      error: (error) => {
        console.error('Error al buscar el chollo:', error);
      }
    });
  }

  cleanSearch(){
    this.searchChollos.setValue(''); // Vaciar el input de búsqueda
    this.getAllChollos();
  }

  // Método para obtener todos los chollos
  getAllChollos(): void {
    this.homeService.getAllChollos().subscribe({
      next: (data) => {
        this.chollos = data.sort((a: any, b: any) => {
          const dateA = new Date(a.updatedAt || a.createdAt).getTime();
          const dateB = new Date(b.updatedAt || b.createdAt).getTime();
          return dateB - dateA; // Orden descendente (más reciente primero)
        });
      },
      error: (error) => {
        console.error('Error al obtener los chollos:', error);
      }
    });
  }



  // Método para buscar un chollo por título
  /*searchChollo(): void {
    console.log('metodo searchChollo.');
    if (this.searchTitle.trim() === '') {
      console.log('titulo vacio');
      this.getAllChollos();

    }

      this.homeService.getCholloByTitle(this.searchTitle).subscribe({
        next: (chollos) => {
          this.chollos = chollos; // Muestra solo el chollo encontrado
        },
        error: (error) => {
          console.error('Error al buscar el chollo:', error);
          this.chollos = []; // Si hay un error o no se encuentra nada, limpia el array
        }
      });

  }*/





  // Navega a la página de autenticación
  login() {
    this.router.navigate(['./auth']);
  }

/*
  // Computed property para verificar si el usuario está autenticado
  public isAuthenticated = computed<boolean>(() => {
    return this.authService.authStatus() === AuthStatus.authenticated;
  });

  // Método para manejar la navegación según el estado de autenticación
  navigateBasedOnAuthStatus() {
    if (this.isAuthenticated()) {
      this.router.navigateByUrl('/dashboard');
    } else {
      this.router.navigateByUrl('/auth/login');
    }
  }*/

  // Cierra la sesión
  onLogout() {
    this.authService.logout();
  }
}
