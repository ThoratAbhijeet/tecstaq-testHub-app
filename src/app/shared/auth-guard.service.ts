import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild{

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
  boolean | Observable<boolean> | Promise<boolean> {
    let accessToken=localStorage.getItem('accessToken')as string;
    if (accessToken==null) {
      this.router.navigate(['']);
    }
    return true
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
  boolean | Observable<boolean> | Promise<boolean> {
    return this.canActivate(route, state);
  }
}