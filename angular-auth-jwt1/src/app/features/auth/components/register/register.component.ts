import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { MustMatch } from './validators/MustMatch';
import { Router } from '@angular/router';
import { ICurrentUser } from 'src/app/core/auth/models/i-current-user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;
  subRegister: Subscription;
  error: string;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
    }, {
        validator: MustMatch('password', 'confirmPassword')
    });


    this.registerForm.controls['email'].setValue('test@test.fr');
    this.registerForm.controls['password'].setValue('222222');
    this.registerForm.controls['confirmPassword'].setValue('222222');
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = null;

    if (this.registerForm.invalid) {
      return;
    }

    this.subRegister = this.authService.register(this.registerForm.value.email, this.registerForm.value.password).subscribe((user: ICurrentUser) => {
        // initialisation
        user.isLogged = true;
        user.email = this.registerForm.value.email;
        // enregistre et émet le nouvel utilisateur pour les composants qui ont souscrit
        this.authService.updateAndEmitCurrentUser(user);
        // à la connexion, on se rends à la page : /home
        this.router.navigateByUrl('/home');
      },
      error => {
        if (error.status == 401) {
          this.error = 'l\'email ou le mot de passe existe déjà';
        }  else {
          this.error = error.message + ' status : ' + error.status;
        }
      }
    )
  }

  onReset(): void {
    this.submitted = false;
    this.registerForm.reset();
  }

  ngOnDestroy(): void {
    if (this.subRegister) {
      this.subRegister.unsubscribe();          // important : toujours se désabonner !
    }
  }
}
