import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Router } from '@angular/router';
import { ICurrentUser } from 'src/app/core/auth/models/i-current-user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @Output() cancelEvent = new EventEmitter<boolean>();          // averti le parent que l'utilisateur souhaite fermer ou annuler la demande de connexion
                                                                // ainsi le parent peut fermer le composant : Login
  subLogin : Subscription;
  loginForm: FormGroup;
  submitted = false;
  error: string;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
      this.loginForm = this.formBuilder.group({
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required, Validators.minLength(6)]],
      }, {

      });

      this.loginForm.controls['email'].setValue('test21@test.fr');
      this.loginForm.controls['password'].setValue('222222');

  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = null;

    if (this.loginForm.invalid) {
      return;
    }

    this.subLogin = this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe((user: ICurrentUser) => {
      // initialisation
      user.isLogged = true;
      user.email = this.loginForm.value.email;
      // enregistre et émet le nouvel utilisateur pour les composants qui ont souscrit
      this.authService.updateAndEmitCurrentUser(user);
      // clos le formulaire de connexion
      this.cancelEvent.emit(true);
      // à la connexion, on se rends à la page : /home
      this.router.navigateByUrl('/home');
    },
    error => {
      if (error.status == 401) {
        this.error = 'l\'email ou le mot de passe est incorrect';
      }  else {
        this.error = error.message + ' status : ' + error.status;
      }
    });
  }

  cancel() {
    this.cancelEvent.emit(true);
  }

  ngOnDestroy(): void {
    if (this.subLogin) {
      this.subLogin.unsubscribe();          // important : toujours se désabonner !
    }
  }
}
