import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IProduct } from '../models/i-product';
import { HttpService } from '../../../core/http/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class ProductApiService extends HttpService<IProduct> {      // on hérite de la classe : HttpService, donc de toutes ces méthodes et propriétés
                                                                    // <IProduct> : on précise à la classe que le type 'generic' doit être du type : IProduct

  constructor(httpClient: HttpClient) {
    super(                          // super : permet de faire appel au constructeur de la classe que l'on hérite (HttpService)

      httpClient,
      environment.urlApi,
      environment.pathApi,
      environment.endPointProducts
    );
  }
}
