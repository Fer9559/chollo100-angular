import { computed, inject, Injectable, signal } from '@angular/core';
import { enviroment } from '../../../enviroments/enviroments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { AuthStatus, LoginResponse } from '../interfaces';
import { isAuthenticatedGuard } from '../guards/isAuthenticated.guard';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string = enviroment.baseUrl;
  private http = inject(HttpClient);

  private _currentUser = signal<LoginResponse | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.notAuthenticated);

  //!Al mundo exterior

  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  login(email: string, password: string): Observable<Boolean> {

    this._authStatus.set(AuthStatus.checking);
    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password };

    return this.http.post<LoginResponse>(url, body)
      .pipe(
        tap(({ id_user, email, password, fullName, token }) => {
          const user = { id_user, email, password, fullName, token };
          this._currentUser.set(user);
          this._authStatus.set(AuthStatus.authenticated);
          localStorage.setItem('token', token);
        }),

        map(() => true),

        //errores
        catchError((err) => {
          this._authStatus.set(AuthStatus.notAuthenticated);
          return throwError(() => err.error.message);

        })
      )
  }


  register(email: string, password: string, fullName: string): Observable<Boolean> {

    this._authStatus.set(AuthStatus.checking);
    const url = `${this.baseUrl}/auth/register`;
    const body = { email, password, fullName };

    return this.http.post<LoginResponse>(url, body)
      .pipe(
        tap(({ id_user, email, password, fullName, token }) => {
          const user = { id_user, email, password, fullName, token };
          this._currentUser.set(user);
          this._authStatus.set(AuthStatus.authenticated);
          localStorage.setItem('token', token);
        }),

        map(() => true),

        //errores
        catchError((err) => {
          this._authStatus.set(AuthStatus.notAuthenticated);
          return throwError(() => err.error.message);

        })
      )
  }



  checkAuthStatus(): Observable<boolean> {

    this._authStatus.set(AuthStatus.checking);
    const url = `${this.baseUrl}/auth/check-token`;
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.get<LoginResponse>(url, { headers })
      .pipe(
        map(({ id_user, email, password, fullName, token }) => {
          const user = { id_user, email, password, fullName, token };
          this._currentUser.set(user);
          this._authStatus.set(AuthStatus.authenticated);
          localStorage.setItem('token', token);

          return true;
        }),
        catchError(() => {
          this._authStatus.set(AuthStatus.notAuthenticated);
          return of(false);
        })
      );
  }


  logout() {
    localStorage.removeItem('token');

    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);

  }


  getUserId(): string {
    const currentUser = this._currentUser();

    if (!currentUser) {
      throw new Error('Usuario no autenticado. No se puede obtener el ID.');
    }

    return currentUser.id_user;
  }
  // Aquí puedes tener métodos para obtener el ID
  //getUserId(): string {
  // Lógica para obtener el ID del usuario, puede ser desde el localStorage o un servicio
  //return 'USER_ID'; // Reemplaza con tu lógica real
  //}
}
