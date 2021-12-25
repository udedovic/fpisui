import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { serverURL } from '../config';

@Injectable({
  providedIn: 'root'
})
export class ProizvodService {
  private url = serverURL + 'product/';

  constructor(private httpClient: HttpClient) {}
}
