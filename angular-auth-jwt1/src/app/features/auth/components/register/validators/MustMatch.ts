import { FormGroup } from '@angular/forms';

export function MustMatch(controlName: string, matchingControlName: string) {       // correspond aux champs : password et confirmPassword
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];                            // password
        const matchingControl = formGroup.controls[matchingControlName];            // confirmPassword

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {    // si déjà trouvé une erreur ailleurs dans un autre champ
            return;                                                           // alors pas besoin d'analyser le contrôle des mots de passe
        }

        if (control.value !== matchingControl.value) {                        // si les deux mots de passe ne correspondent pas
            matchingControl.setErrors({ mustMatch: true });                   // il y a une erreur
        } else {
            matchingControl.setErrors(null);                                  //
        }
    }
}
