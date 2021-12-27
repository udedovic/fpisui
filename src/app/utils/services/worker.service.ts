import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { serverURL } from '../config';
import { IWorker } from '../interfaces/worker';

@Injectable({
  providedIn: 'root',
})
export class WorkerService {
  private url = serverURL + 'worker/';

  constructor(private httpClient: HttpClient) {}

  findWorker(sifra: number): Observable<IWorker> {
    return this.httpClient.get<IWorker>(this.url + sifra);
  }
}
