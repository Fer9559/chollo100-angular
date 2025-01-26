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
  searchChollos = new FormControl('');


  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.getAllChollos();

     this.searchChollos.valueChanges.pipe(
      filter((titulo): titulo is string => titulo !== null),
      debounceTime(100),
      filter((titulo: string) => titulo.length >= 3),
      switchMap(titulo => {
        return this.homeService.getCholloByTitle(titulo);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (chollos) => {
        this.chollos = chollos;
      },
      error: (error) => {
      }
    });

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

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
