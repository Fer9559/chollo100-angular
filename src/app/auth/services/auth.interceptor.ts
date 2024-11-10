
import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import {
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';

export function authInterceptor (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  console.log('interceptor funciona', req);
  const token = localStorage.getItem('token');

  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });

    return next(cloned);
  }
  return next(req);
}
