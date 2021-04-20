import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageRegisterRoutingModule } from './page-register-routing.module';
import { PageRegisterComponent } from './page-register.component';
import { AuthModule } from 'src/app/features/auth/auth.module';

@NgModule({
  declarations: [ PageRegisterComponent ],
  imports: [ CommonModule, PageRegisterRoutingModule, AuthModule, ],
})
export class PageRegisterModule { }
