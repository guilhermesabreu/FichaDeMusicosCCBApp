import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, Observable } from 'rxjs';
import { Pessoa } from 'src/app/models/Pessoa';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseURLPessoa = 'https://fichademusicosccbapi.herokuapp.com/api/v1/pessoas';
  decodedToken: any;
  jwtHelper = new JwtHelperService();
  constructor(private http: HttpClient
             ,private router: Router) { }

  despertarServidor(){
    return this.http.get(`${this.baseURLPessoa}/despertador`);    
  }

  login(model: any) {
    return this.http
    .post(`${this.baseURLPessoa}/login`, model).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          localStorage.setItem('token', JSON.stringify(user.token).slice(1, -1));
          sessionStorage.setItem('username', JSON.stringify(user.user).slice(1, -1));
        }
      })
      );
    }
    
    roleMatch(allowedRoles:any): boolean {
      var isMatch = false;
      var payLoad = JSON.parse(window.atob(localStorage.getItem('token')!.split('.')[1]));
      var userRole = payLoad.role;
      allowedRoles.forEach((element: any) => {
        if(userRole == element){
          sessionStorage.setItem('role', payLoad.role);
          isMatch = true;
          return false;
        }
        return true;
      });
      return isMatch;
    }

    loggedIn() {
      const token = localStorage.getItem('token');
      var urlPrincipal = this.router.url.indexOf("login");
      
      if(urlPrincipal > 0){
        return false;
      }
      else if(!this.jwtHelper.isTokenExpired(token!)){
        return true;
      }
      else{
        return false;
      }
    }
}
