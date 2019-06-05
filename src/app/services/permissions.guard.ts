import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const ups = parseInt(localStorage.getItem('us_type'), 10);

    if (state.url === '/usuarios') {
      if (ups === 3) {
        return true;
      } else {
        this.router.navigate(['/inicio']);
        return false;
      }
    } else if (state.url === '/ofertas') {
      if (ups === 3 || ups === 2) {
        return true;
      } else {
        this.router.navigate(['/inicio']);
        return false;
      }
    }
    return state.url === '/inicio';
  }
}
