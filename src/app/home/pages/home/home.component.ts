import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { HomeServiceService } from '../../services/homeService.service';
import { FormControl } from '@angular/forms';
import { debounceTime, filter, switchMap, takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit  {

  private authService = inject(AuthService);
  private homeService = inject(HomeServiceService);
  private router = inject(Router);

  chollos: any[] = [];
  searchChollos = new FormControl(''); // FormControl para manejar la entrada de búsqueda

  // Subject para controlar la vida de la suscripción
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.getAllChollos(); // Cargar todos los chollos al iniciar

     this.searchChollos.valueChanges.pipe(
      filter((titulo): titulo is string => titulo !== null),
      debounceTime(100),
      filter((titulo: string) => titulo.length >= 3),
      switchMap(titulo => {
        console.log('switchMap ejecutado con título:', titulo); // Log para observar cada emisión en switchMap
        return this.homeService.getCholloByTitle(titulo);
      }),
      takeUntil(this.destroy$) // Se completa cuando el componente se destruye
    ).subscribe({
      next: (chollos) => {
        console.log('Suscripción ejecutada con resultados:', chollos); // Log para observar cada emisión del observable
        this.chollos = chollos;
      },
      error: (error) => {
        console.error('Error al buscar el chollo:', error);
      }
    });

    //console.log('Suscripción activa:', this.subscription); // Log para observar el estado de la suscripción
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // Emitir valor para completar las suscripciones
    this.destroy$.complete(); // Completar el Subject
  }

  // Método para limpiar la búsqueda y mostrar todos los chollos
  cleanSearch() {
    this.searchChollos.setValue('');
    this.getAllChollos();
  }

  getAllChollos(): void {
    this.homeService.getAllChollos().subscribe({
      next: (data) => {
        this.chollos = data.sort((a: any, b: any) => {
          const dateA = new Date(a.updatedAt || a.createdAt).getTime();
          const dateB = new Date(b.updatedAt || b.createdAt).getTime();
          return dateB - dateA;
        });
      },
      error: (error) => {
        console.error('Error al obtener los chollos:', error);
      }
    });
  }



}
