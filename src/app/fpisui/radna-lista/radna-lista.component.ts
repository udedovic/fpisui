import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IAbsenceItem, IPresenceItem } from 'src/app/utils/interfaces/item';
import { IWorker } from 'src/app/utils/interfaces/worker';
import { WorkerService } from 'src/app/utils/services/worker.service';

@Component({
  selector: 'app-radna-lista',
  templateUrl: './radna-lista.component.html',
  styleUrls: ['./radna-lista.component.css'],
})
export class RadnaListaComponent implements OnInit {
  //top part
  worksheetTitle: string = 'Unos radne liste';
  sifraRadnikaInput: FormControl = new FormControl(null);
  sifraRadneListe: FormControl = new FormControl(null);
  ELEMENT_DATA_RADNIK: IWorker[] = [];
  radnikTable = new MatTableDataSource(this.ELEMENT_DATA_RADNIK);
  radnikTableColumns: string[] = ['imePrezime', 'jmbg', 'radnoMesto'];

  //prisustvo
  redniBrojPrisustva: FormControl = new FormControl(null);
  vrstaPrisustva: FormControl = new FormControl('0');
  opisPrisustva: FormControl = new FormControl(null);
  datumPrisustva: FormControl = new FormControl(new Date());
  ELEMENT_DATA_PRISUSTVO: IPresenceItem[] = [];
  prisustvoTable = new MatTableDataSource(this.ELEMENT_DATA_PRISUSTVO);
  prisustvoTableColumns: string[] = [
    'redniBroj',
    'vrstaPrisustva',
    'opis',
    'datum',
  ];

  //odsustvo
  redniBrojOdsustva: FormControl = new FormControl(null);
  vrstaOdsustva: FormControl = new FormControl('0');
  brojOdluke: FormControl = new FormControl(null);
  datumOd: FormControl = new FormControl(new Date());
  datumDo: FormControl = new FormControl(new Date());
  ELEMENT_DATA_ODSUSTVO: IAbsenceItem[] = [];
  odsustvoTable = new MatTableDataSource(this.ELEMENT_DATA_ODSUSTVO);
  odsustvoTableColumns: string[] = [
    'redniBroj',
    'brojOdluke',
    'vrstaOdsustva',
    'datumOd',
    'datumDo',
  ];

  constructor(private router: Router, private workerService: WorkerService) {}

  ngOnInit(): void {}

  findWorker() {
    this.ELEMENT_DATA_RADNIK = [];
    if (
      this.sifraRadnikaInput.value == null ||
      this.sifraRadnikaInput.value == ''
    ) {
      return;
    }
    this.workerService
      .findWorker(this.sifraRadnikaInput.value)
      .subscribe((worker) => {
        this.ELEMENT_DATA_RADNIK.push(worker);
        this.radnikTable = new MatTableDataSource(this.ELEMENT_DATA_RADNIK);
      });
  }

  findWorksheet(){

  }

  createNewWorksheet(){

  }

  deletePresenceItem(){

  }

  savePresenceItem(){

  }

  deleteAbsenceItem(){

  }

  saveAbsenceItem(){
    
  }

  redirectToMainPage() {
    this.router.navigate(['/main-page']);
  }
}
