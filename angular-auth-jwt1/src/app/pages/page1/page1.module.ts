import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Page1RoutingModule } from './page1-routing.module';
import { Page1Component } from './page1.component';
import { MaterialDesignModule } from 'src/app/shared/material-design/material-design.module';

@NgModule({
  declarations: [Page1Component],
  imports: [
    CommonModule,
    Page1RoutingModule,
    MaterialDesignModule,
  ]
})
export class Page1Module { }
