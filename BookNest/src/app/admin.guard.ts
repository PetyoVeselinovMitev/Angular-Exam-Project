import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isLoggedIn.pipe(
      take(1),
      switchMap(isLoggedIn => {
        if (isLoggedIn) {
          return this.authService.currentUser.pipe(
            take(1),
            map(currentUser => {
              const isAdmin = currentUser && currentUser.role === 'admin';
              if (isAdmin) {
                return true;
              } else {
                this.router.navigate(['/login']);
                return false;
              }
            })
          );
        } else {
          this.router.navigate(['/']);
          return of(false);
        }
      })
    );
  }
}
