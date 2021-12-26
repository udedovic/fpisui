import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { serverURL } from '../config';
import { IProduct } from '../interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private url = serverURL + 'product/';

  constructor(private httpClient: HttpClient) {}

  getNewId(): Observable<number> {
    return this.httpClient.get<number>(this.url + 'new-id');
  }

  findProduct(sifra: number): Observable<IProduct> {
    return this.httpClient.get<IProduct>(this.url + sifra);
  }

  insertProduct(product: IProduct): Observable<boolean> {
    return this.httpClient.post<boolean>(this.url, product);
  }

  updateProduct(product: IProduct): Observable<boolean> {
    return this.httpClient.put<boolean>(this.url, product);
  }
}
