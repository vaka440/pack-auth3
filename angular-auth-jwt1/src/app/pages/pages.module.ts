import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturesModule } from '../features/features.module';
import { CoreModule } from '../core/core.module';
import { Page1Module } from './page1/page1.module';
import { Page2Module } from './page2/page2.module';
import { PageRegisterModule } from './page-register/page-register.module';
import { PartialsModule } from './partials/partials.module';
import { PageHomeModule } from './page-home/page-home.module';
import { AuthModule } from '../features/auth/auth.module';
import { PageLoginModule } from './page-login/page-login.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FeaturesModule,
    CoreModule,
    Page1Module,
    Page2Module,
    PageLoginModule,
    PageRegisterModule,
    PartialsModule,
    PageHomeModule,
    AuthModule,
    PageLoginModule,
  ],
  exports: [PartialsModule],            // on exporte le module car il sera utilisé par le composant de démarrage : app.component.html
})
export class PagesModule { }
