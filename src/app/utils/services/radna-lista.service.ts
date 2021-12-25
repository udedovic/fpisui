import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { serverURL } from '../config';

@Injectable({
  providedIn: 'root',
})
export class RadnaListaService {
  private url = serverURL + 'worksheet/';

  constructor(private httpClient: HttpClient) {}
}
