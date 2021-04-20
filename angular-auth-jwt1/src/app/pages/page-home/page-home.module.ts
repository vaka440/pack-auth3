import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageHomeRoutingModule } from './page-home-routing.module';
import { PageHomeComponent } from './page-home.component';


@NgModule({
  declarations: [PageHomeComponent],
  imports: [
    CommonModule,
    PageHomeRoutingModule
  ]
})
export class PageHomeModule { }
