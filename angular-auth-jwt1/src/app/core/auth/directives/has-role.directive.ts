import { Directive, Input, ViewContainerRef, TemplateRef, OnInit, OnDestroy,  } from '@angular/core';
import { Subscription } from 'rxjs';
import { ICurrentUser } from '../models/i-current-user';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit, OnDestroy {
  @Input() appHasRole: Array<string>;   // réception de la valeur(du rôle souhaité) défini dans le template
  subCurrentUserObs: Subscription;      // pour contenir l'observable (afin de pouvoir se désabonner dans le ngOnDestroy)

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    // on souscrit à CurrentUserObs et donc à chaque changement d'utilisateur, on reçoit le nouveau : user
    this.subCurrentUserObs = this.authService.getCurrentUserObs().subscribe((user: ICurrentUser) => {

      // on oblige à ce qu'il y est au moins un rôle qui est défini dans l'utilisation de la directive du template
      if (!this.appHasRole || !this.appHasRole.length) {
        throw new Error('attention, il n\'y a pas de rôle défini');
      }

      let hasAccess = false;
      if (user.roles) {
        hasAccess = user.roles.some(role => this.appHasRole.includes(role));    // some --> pour tous les roles contenu dans user
      }
      if (hasAccess) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainerRef.clear();
      }
    });
  }

  ngOnDestroy(): void {
    this.subCurrentUserObs.unsubscribe();   // important : toujours, toujours se désabonner !
  }
}
