import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageLoginRoutingModule } from './page-login-routing.module';
import { PageLoginComponent } from './page-login.component';
import { AuthModule } from 'src/app/features/auth/auth.module';


@NgModule({
  declarations: [PageLoginComponent],
  imports: [CommonModule, PageLoginRoutingModule, AuthModule, ]
})
export class PageLoginModule { }
