import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { IProduct } from 'src/app/features/product/models/i-product';
import { ProductApiService } from 'src/app/features/product/services/product-api.service';

@Component({
  selector: 'app-page1',
  templateUrl: './page1.component.html',
  styleUrls: ['./page1.component.scss']
})
export class Page1Component implements OnInit {

  products$: Observable<IProduct[]>;    // $ : c'est juste pour indiquer que c'est un observable (pas obligatoire)
  isLogged$: Observable<boolean>;

  constructor(private productApi: ProductApiService, private authService: AuthService) {    }

  ngOnInit(): void {
    console.log("ngOnInit ----")
    this.isLogged$ = this.authService.isLogged();
    this.products$ = this.productApi.get();


  }
}
