import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/AuthService/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private router: Router,
    private service: AuthService) {}
    
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      if (localStorage.getItem('token') !== null) {
        let roles = next.data['permittedRoles'] as Array<string>;
        if(roles){
          if (this.service.roleMatch(roles)){
            return true;
          } else {
            this.router.navigate(['login']);
            return false;
          }
        }
        return true;
      }
      else {
        this.router.navigate(['login']);
        return false;
      }
    }
  }
  