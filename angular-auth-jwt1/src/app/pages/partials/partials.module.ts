import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AuthModule } from 'src/app/features/auth/auth.module';
import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    AuthModule,
    CoreModule,
  ],
  exports: [HeaderComponent],
})
export class PartialsModule { }
