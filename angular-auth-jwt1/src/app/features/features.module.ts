import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CoreModule,
    AuthModule,
    ProductModule
  ]
})
export class FeaturesModule { }
