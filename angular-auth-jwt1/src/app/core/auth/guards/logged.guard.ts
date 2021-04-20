import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedGuard implements CanActivate {       // on implémente l'interface : CanActivate
                                                        // liste des autres interfaces : CanActivate, CanActivateChild, CanDeactivate, CanLoad et Resolve
                                                        // vous pouvez allez voir son utilisation pour la page 2 dans : app-routing.module.ts
  constructor(private authService: AuthService){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authService.isLogged();               // isLogged est un observable qui retourne true ou false
  }

  // remarquez les différents types que l'on peut retourner avec la méthode : canActivate
  // ------->  : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
}
