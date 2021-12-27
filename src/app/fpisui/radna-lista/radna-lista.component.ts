import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { InformationDialogComponent } from 'src/app/shared-module/information-dialog/information-dialog.component';
import { IAbsenceItem, IPresenceItem } from 'src/app/utils/interfaces/item';
import { IWorker } from 'src/app/utils/interfaces/worker';
import { WorkerService } from 'src/app/utils/services/worker.service';
import { WorksheetService } from 'src/app/utils/services/worksheet.service';

@Component({
  selector: 'app-radna-lista',
  templateUrl: './radna-lista.component.html',
  styleUrls: ['./radna-lista.component.css'],
})
export class RadnaListaComponent implements OnInit {
  //top part
  worksheetTitle: string = 'Unos radne liste';
  ELEMENT_DATA_RADNIK: IWorker[] = [];
  radnikTable = new MatTableDataSource(this.ELEMENT_DATA_RADNIK);
  radnikTableColumns: string[] = ['imePrezime', 'jmbg', 'radnoMesto'];

  //forma
  frmWorksheet: FormGroup;

  //prisustvo

  ELEMENT_DATA_PRISUSTVO: IPresenceItem[] = [];
  prisustvoTable = new MatTableDataSource(this.ELEMENT_DATA_PRISUSTVO);
  prisustvoTableColumns: string[] = [
    'redniBroj',
    'vrstaPrisustva',
    'opis',
    'datum',
  ];

  //odsustvo
  ELEMENT_DATA_ODSUSTVO: IAbsenceItem[] = [];
  odsustvoTable = new MatTableDataSource(this.ELEMENT_DATA_ODSUSTVO);
  odsustvoTableColumns: string[] = [
    'redniBroj',
    'brojOdluke',
    'vrstaOdsustva',
    'datumOd',
    'datumDo',
  ];

  constructor(
    private router: Router,
    private workerService: WorkerService,
    private worksheetService: WorksheetService,
    private dialog: MatDialog,
    private datepipe: DatePipe,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.frmWorksheet = this.formBuilder.group({
      sifraRadnika: [null, Validators.required],
      sifraRadneListe: [null, Validators.required],
      prisustvo: this.formBuilder.group({
        redniBrojPrisustva: [null, Validators.required],
        vrstaPrisustva: ['0', Validators.required],
        opisPrisustva: [null, Validators.required],
        datumPrisustva: [new Date(), Validators.required],
      }),
      odsustvo: this.formBuilder.group({
        redniBrojOdsustva: [null, Validators.required],
        vrstaOdsustva: ['0', Validators.required],
        brojOdluke: [null, Validators.required],
        datumOd: [new Date(), Validators.required],
        datumDo: [new Date(), Validators.required],
      }),
    });
  }

  findWorker(event) {
    event.preventDefault();
    if (
      this.frmWorksheet.get('sifraRadnika').value == null ||
      this.frmWorksheet.get('sifraRadnika').value == ''
    ) {
      return;
    }
    this.workerService
      .findWorker(this.frmWorksheet.get('sifraRadnika').value)
      .subscribe((worker) => {
        if (worker) {
          this.fillWorkerInfo(worker);
        } else {
          this.openDialog(true, 'Greška', 'Uneli ste nepostojećeg radnika!');
        }
      });
  }

  fillWorkerInfo(worker: IWorker) {
    this.ELEMENT_DATA_RADNIK = [];
    this.ELEMENT_DATA_RADNIK.push(worker);
    this.frmWorksheet.get('sifraRadnika').setValue(worker.sifra);
    this.radnikTable = new MatTableDataSource(this.ELEMENT_DATA_RADNIK);
  }

  findWorksheet(event) {
    event.preventDefault();
    if (this.frmWorksheet.get('sifraRadneListe').invalid) {
      return;
    }
    this.worksheetService
      .findWorksheet(this.frmWorksheet.get('sifraRadneListe').value)
      .subscribe({
        next: (worksheet) => {
          if (worksheet) {
            this.fillWorkerInfo(worksheet.worker);
            if (worksheet.presenceItemList) {
              this.fillPresenceItemListInfo(worksheet.presenceItemList);
            }
            if (worksheet.absenceItemList) {
              this.fillAbsenceItemListInfo(worksheet.absenceItemList);
            }
          } else {
            this.openDialog(
              true,
              'Greška',
              'Uneli ste nepostojeću radnu listu!'
            );
          }
        },
      });
  }

  fillPresenceItemListInfo(presenceItemList: IPresenceItem[]) {
    this.ELEMENT_DATA_PRISUSTVO = [];
    for (let p of presenceItemList) {
      this.ELEMENT_DATA_PRISUSTVO.push(p);
    }
    this.prisustvoTable = new MatTableDataSource(this.ELEMENT_DATA_PRISUSTVO);
  }

  fillAbsenceItemListInfo(absenceItemList: IAbsenceItem[]) {
    this.ELEMENT_DATA_ODSUSTVO = [];
    for (let o of absenceItemList) {
      this.ELEMENT_DATA_ODSUSTVO.push(o);
    }
    this.odsustvoTable = new MatTableDataSource(this.ELEMENT_DATA_ODSUSTVO);
  }

  showDate(date: Date): string {
    if (date === null) return '';
    return this.datepipe.transform(date, 'dd.MM.yyyy.');
  }

  preparePresenceType(vrsta: number): string {
    switch (vrsta) {
      case 0:
        return 'Radno vreme';
      case 1:
        return 'Prekovremeno';
      case 2:
        return 'Vikend';
      case 3:
        return 'Praznik';
    }
  }

  prepareAbsenceType(vrsta: number): string {
    switch (vrsta) {
      case 0:
        return 'Godišnji odmor';

      case 1:
        return 'Službeni put';
      case 2:
        return 'Bolovanje';
      case 3:
        return 'Plaćeno ods.';
      case 4:
        return 'Neplaćeno ods.';
      case 5:
        return 'Praznik';
      case 6:
        return 'Slava';
      case 7:
        return 'Slobodan dan';
      case 8:
        return 'Neopravdano ods.';
    }
  }

  createNewWorksheet(event) {
    event.preventDefault();
    this.worksheetService
      .getNewId()
      .subscribe((id) => this.frmWorksheet.get('sifraRadneListe').setValue(id));
  }

  deletePresenceItem(event) {
    event.preventDefault();
  }

  savePresenceItem(event) {
    event.preventDefault();
  }

  deleteAbsenceItem(event) {
    event.preventDefault();
  }

  saveAbsenceItem(event) {
    event.preventDefault();
  }

  openDialog(isError: boolean, dialogTitle: string, dialogText: string): void {
    this.dialog.open(InformationDialogComponent, {
      width: '500px',
      data: {
        isError: isError,
        dialogTitle: dialogTitle,
        dialogText: dialogText,
      },
    });
  }

  resetAllFields(event) {
    event.preventDefault();
    this.frmWorksheet.reset();
    this.frmWorksheet.get('prisustvo.datumPrisustva').setValue(new Date());
    this.frmWorksheet.get('odsustvo.datumOd').setValue(new Date());
    this.frmWorksheet.get('odsustvo.datumDo').setValue(new Date());
    this.ELEMENT_DATA_RADNIK = [];
    this.radnikTable = new MatTableDataSource(this.ELEMENT_DATA_RADNIK);
    this.ELEMENT_DATA_PRISUSTVO = [];
    this.prisustvoTable = new MatTableDataSource(this.ELEMENT_DATA_PRISUSTVO);
    this.ELEMENT_DATA_ODSUSTVO = [];
    this.odsustvoTable = new MatTableDataSource(this.ELEMENT_DATA_ODSUSTVO);
  }

  saveWorksheet(event) {
    event.preventDefault();
  }

  redirectToMainPage() {
    this.router.navigate(['/main-page']);
  }
}
