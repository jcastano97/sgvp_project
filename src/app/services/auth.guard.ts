import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpService } from './http.service';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private service: HttpService
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const data = {
      function: 'Auth',
      us_id: localStorage.getItem('us_id'),
      token: localStorage.getItem('ustk_token'),
      us_type: localStorage.getItem('us_type')
    };
    if (data.token != null) {
      return this.service.get(data).pipe(map(res => {
        const response: any = {};
        if (response.data === 'unauthorized') {
          localStorage.clear();
          this.router.navigate(['/']);
          return false;
        } else {
          return true;
        }
      }));
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
