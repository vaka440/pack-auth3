import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Material
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatFormFieldModule,               // on importe uniquement les composants dont on a besoin
    NoopAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
  ],
  exports: [
    MatFormFieldModule,               // ne pas oublier d'exporter pour qu'il puisse être importé dans le module qui le demande
    NoopAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
  ]
})
export class MaterialDesignModule { }
