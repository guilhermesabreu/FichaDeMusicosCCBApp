import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/internal/operators/tap';


@Injectable({providedIn: 'root'})
export class AuthInterceptor implements HttpInterceptor{

    constructor(private router: Router) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        if (localStorage.getItem('token') !== null) {
            const cloneReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
            });
            return next.handle(cloneReq).pipe(
                tap(
                    succ => {},
                    err => {
                        if(err.status === 401){
                            localStorage.removeItem('token');
                            this.router.navigateByUrl('login');
                        }
                        else if(err.status == 403)
                            this.router.navigateByUrl('login');
                    }
                )
            );
        }
        else {
            return next.handle(req.clone());
        }
    }
}