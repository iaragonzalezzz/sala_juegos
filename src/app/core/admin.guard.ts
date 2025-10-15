import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const user = await this.auth.getUser();

    if (!user) {
      //si no hay usuario logueado, redirigir al login
      this.router.navigate(['/login']);
      return false;
    }

    //verifica si es admin usando tu método actualizado
    const esAdmin = await this.auth.isAdmin();
    if (!esAdmin) {
      // Si no es admin, redirigir a otra página (por ej. home)
      this.router.navigate(['/']);
      return false;
    }

    return true; //usuario es admin, puede pasar
  }
}
