import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ICurrentUser } from 'src/app/core/auth/models/i-current-user';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { RoleEnum } from '../../../core/auth/enums/role-enum';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  currentUser$: Observable<ICurrentUser>;
  RoleEnum: typeof RoleEnum = RoleEnum;                 // on récupère les énumerations des rôles pour le template

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.currentUser$ = this.auth.getCurrentUserObs();  // on récupère l'Observable au lieu du "subjet" car on ne doit rien émettre, juste écouter !
  }

  logout() {
    this.auth.logout();
    return false;
  }
}
