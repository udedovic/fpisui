import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { serverURL } from '../config';
import { IWorksheet } from '../interfaces/worksheet';

@Injectable({
  providedIn: 'root',
})
export class WorksheetService {
  private url = serverURL + 'worksheet/';

  constructor(private httpClient: HttpClient) {}

  getNewId(): Observable<number> {
    return this.httpClient.get<number>(this.url + 'new-id');
  }

  findWorksheet(sifra: number): Observable<IWorksheet> {
    return this.httpClient.get<IWorksheet>(this.url + sifra);
  }
}
