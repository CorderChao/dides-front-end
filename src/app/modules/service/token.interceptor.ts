import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
    HttpResponse
} from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { environment } from 'src/environments/environment.prod';

@Injectable()

export class JwtInterceptor implements HttpInterceptor {

    constructor(private authService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Add authorization header with JWT token if available
        const token = JSON.parse(localStorage.getItem("currentClient"));
       const isApiUrl = request.url.startsWith(environment.BASE_API+`:8089`);
        if (token && isApiUrl) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }else{
      request = request.clone()
      }
        return next.handle(request)
            .pipe(
                map((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        return event;
                    }
                    return event;
                }),
                catchError((error: HttpErrorResponse) => {
                    let data = {};
                    data = {
                        reason: error && error.error.reason ? error.error.reason : "",
                        status: error.status,
                    };
                    this.authService.failedRequest(data);
                    return throwError(() => error);
                })
            );

    }
}