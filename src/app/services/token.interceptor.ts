import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    console.log('Intercepting request to:', request.url);
    console.log('Token present:', !!token);

    const publicEndpoints = [
      `${environment.apiUrl}/register/`,
      `${environment.apiUrl}/login/`
    ];

    const isPublic = publicEndpoints.some(url => request.url.startsWith(url));
    console.log('Is public:', isPublic);

    if (token && !isPublic) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(request);
  }
}
