import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { enviroment } from "../../../enviroments/enviroments";
import { Observable, catchError, map, throwError } from "rxjs";
import { CreateChollo } from "../interfaces/create-chollo.interface";
import { ListChollos } from "../interfaces/list-chollo.interface";
import { UpdateChollo } from "../interfaces/update-chollo.interface";




@Injectable({
  providedIn: 'root'
})
export class dashboardService {

  private readonly baseUrl: string = enviroment.baseUrl;
  private http = inject( HttpClient );

  constructor() {}


  getUserChollos(userId: string): Observable<any> {

    return this.http.get<ListChollos>(`${this.baseUrl}/chollos/user-chollos/${userId}`);
  }

  getCholloById(id_chollo: string): Observable<UpdateChollo> {
    return this.http.get<ListChollos>(`${this.baseUrl}/chollos/filter-by-title/${id_chollo}`);
  }

  create(titulo: string, precio: number, enlace: string, descripcion: string, images: string[]): Observable<Boolean> {
    const url = `${ this.baseUrl }/chollos/create`;
    const body = { titulo, precio, enlace, descripcion, images };

    return this.http.post<CreateChollo>(url, body).pipe(
      map(response => !!response.id_chollo),
      catchError(err => throwError(() => err.error.message || 'Error creando el chollo'))
    );
  }

  update(id_chollo: string, titulo: string, precio: number, enlace: string, descripcion: string, images: string[]): Observable<Boolean> {
    const url = `${ this.baseUrl }/chollos/update-chollo/${id_chollo}`;
    const body = { titulo, precio, enlace, descripcion, images };

    return this.http.patch<UpdateChollo>(url, body).pipe(
      map(response => !!response.id_chollo),
      catchError(err => throwError(() => err.error.message || 'Error actualizando el chollo'))
    );
  }

  delete(id_chollo: string): Observable<any> {
    const url = `${this.baseUrl}/chollos/delete-chollo/${id_chollo}`;

    return this.http.delete(url).pipe(
      catchError((err) => throwError(() => err.error.message || 'Error al eliminar el chollo'))
    );
  }
}
