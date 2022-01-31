import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { InformationDialogComponent } from 'src/app/shared-module/information-dialog/information-dialog.component';
import { FormMode } from 'src/app/utils/form-mode';
import { IAbsenceItem, IPresenceItem } from 'src/app/utils/interfaces/item';
import { IWorker } from 'src/app/utils/interfaces/worker';
import { IWorksheet } from 'src/app/utils/interfaces/worksheet';
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
  ELEMENT_DATA_WORKER: IWorker[] = [];
  radnikTable = new MatTableDataSource(this.ELEMENT_DATA_WORKER);
  radnikTableColumns: string[] = ['imePrezime', 'jmbg', 'radnoMesto'];
  currentWorker: IWorker = null;

  //forma
  frmWorksheet: FormGroup;
  frmWorksheetMode: FormMode = FormMode.insert;

  //prisustvo
  presenceArrayForDatabase: IPresenceItem[] = [];
  ELEMENT_DATA_PRESENCE: IPresenceItem[] = [];
  prisustvoTable = new MatTableDataSource(this.ELEMENT_DATA_PRESENCE);
  prisustvoTableColumns: string[] = [
    'redniBroj',
    'vrstaPrisustva',
    'opis',
    'datum',
  ];
  nextRedniBrojPrisustvo: number = 1;
  presenceMode: FormMode = FormMode.insert;
  selectedPresenceRowIndex = -1;

  //odsustvo
  absenceArrayForDatabase: IAbsenceItem[] = [];
  ELEMENT_DATA_ABSENCE: IAbsenceItem[] = [];
  odsustvoTable = new MatTableDataSource(this.ELEMENT_DATA_ABSENCE);
  odsustvoTableColumns: string[] = [
    'redniBroj',
    'brojOdluke',
    'vrstaOdsustva',
    'datumOd',
    'datumDo',
  ];
  nextRedniBrojOdsustvo: number = 1;
  abseceneMode: FormMode = FormMode.insert;
  selectedAbsenceRowIndex = -1;

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
        redniBrojPrisustva: [
          { value: null, disabled: true },
          Validators.required,
        ],
        vrstaPrisustva: ['0', Validators.required],
        opisPrisustva: [null, Validators.required],
        datumPrisustva: [new Date(), Validators.required],
      }),
      odsustvo: this.formBuilder.group({
        redniBrojOdsustva: [
          { value: null, disabled: true },
          Validators.required,
        ],
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
          this.currentWorker = worker;
        } else {
          this.openDialog(true, 'Greška', 'Uneli ste nepostojećeg radnika!');
        }
      });
  }

  fillWorkerInfo(worker: IWorker) {
    this.ELEMENT_DATA_WORKER = [];
    this.ELEMENT_DATA_WORKER.push(worker);
    this.frmWorksheet.get('sifraRadnika').setValue(worker.sifra);
    this.radnikTable = new MatTableDataSource(this.ELEMENT_DATA_WORKER);
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
            this.resetAllFields(null);
            this.frmWorksheet.get('sifraRadneListe').setValue(worksheet.sifra);
            this.fillWorkerInfo(worksheet.worker);
            if (worksheet.presenceItemList) {
              this.fillPresenceItemListInfo(worksheet.presenceItemList);
            }
            this.getNextNumberForInsertPresence(worksheet.presenceItemList);
            if (worksheet.absenceItemList) {
              this.fillAbsenceItemListInfo(worksheet.absenceItemList);
            }
            this.getNextNumberForInsertAbsence(worksheet.absenceItemList);
            this.worksheetTitle = 'Izmena radne liste';
            this.frmWorksheetMode = FormMode.update;
            this.currentWorker = worksheet.worker;
          } else {
            this.openDialog(
              true,
              'Greška',
              'Uneli ste nepostojeću radnu listu!'
            );
            this.frmWorksheetMode = FormMode.insert;
          }
        },
      });
  }

  getNextNumberForInsertPresence(presenceItemList: IPresenceItem[]) {
    if (presenceItemList && presenceItemList.length > 0) {
      this.nextRedniBrojPrisustvo =
        Math.max.apply(
          Math,
          presenceItemList.map(function (o) {
            return o.redniBroj;
          })
        ) + 1;
    } else {
      this.nextRedniBrojPrisustvo = 1;
    }
    this.frmWorksheet
      .get('prisustvo.redniBrojPrisustva')
      .setValue(this.nextRedniBrojPrisustvo);
  }

  getNextNumberForInsertAbsence(absenceItemList: IAbsenceItem[]) {
    if (absenceItemList && absenceItemList.length > 0) {
      this.nextRedniBrojOdsustvo =
        Math.max.apply(
          Math,
          absenceItemList.map(function (o) {
            return o.redniBroj;
          })
        ) + 1;
    } else {
      this.nextRedniBrojOdsustvo = 1;
    }
    this.frmWorksheet
      .get('odsustvo.redniBrojOdsustva')
      .setValue(this.nextRedniBrojOdsustvo);
  }

  fillPresenceItemListInfo(presenceItemList: IPresenceItem[]) {
    this.ELEMENT_DATA_PRESENCE = [];
    presenceItemList.forEach((p) => {
      this.ELEMENT_DATA_PRESENCE.push(p);
      p.status = '';
      this.presenceArrayForDatabase.push(p);
    });
    this.prisustvoTable = new MatTableDataSource(this.ELEMENT_DATA_PRESENCE);
  }

  fillAbsenceItemListInfo(absenceItemList: IAbsenceItem[]) {
    this.ELEMENT_DATA_ABSENCE = [];
    absenceItemList.forEach((a) => {
      this.ELEMENT_DATA_ABSENCE.push(a);
      a.status = '';
      this.absenceArrayForDatabase.push(a);
    });
    this.odsustvoTable = new MatTableDataSource(this.ELEMENT_DATA_ABSENCE);
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
    this.worksheetService.getNewId().subscribe((id) => {
      this.worksheetTitle = 'Unos radne liste';
      this.frmWorksheetMode = FormMode.insert;
      this.resetAllFields(null);
      this.frmWorksheet.get('sifraRadneListe').setValue(id);
      this.getNextNumberForInsertPresence(null);
      this.getNextNumberForInsertAbsence(null);
    });
  }

  highlightPresenceItem(row) {
    if (this.selectedPresenceRowIndex == row.redniBroj) {
      this.selectedPresenceRowIndex = -1;
      this.resetPresenceItemForm();
      this.getNextNumberForInsertPresence(this.ELEMENT_DATA_PRESENCE);
    } else {
      this.presenceMode = FormMode.update;
      this.selectedPresenceRowIndex = row.redniBroj;
      this.frmWorksheet
        .get('prisustvo.redniBrojPrisustva')
        .setValue(row.redniBroj);
      this.frmWorksheet.get('prisustvo.opisPrisustva').setValue(row.opis);
      this.frmWorksheet
        .get('prisustvo.vrstaPrisustva')
        .setValue(row.vrstaPrisustva);
      this.frmWorksheet.get('prisustvo.datumPrisustva').setValue(row.datum);
    }
  }

  deletePresenceItem(event) {
    event.preventDefault();
    if (this.selectedPresenceRowIndex == -1) {
      this.openDialog(true, 'Greška', 'Morate odabrati neki red!');
      return;
    }
    this.ELEMENT_DATA_PRESENCE = this.ELEMENT_DATA_PRESENCE.filter(
      (value, index, array) => value.redniBroj != this.selectedPresenceRowIndex
    );
    for (let i = 0; i < this.ELEMENT_DATA_PRESENCE.length; i++) {
      this.ELEMENT_DATA_PRESENCE[i].redniBroj = i + 1;
    }
    let indexInsert = this.presenceArrayForDatabase.findIndex(
      (value, index, array) =>
        value.redniBroj == this.selectedPresenceRowIndex &&
        value.status == 'insert'
    );
    if (indexInsert != -1) {
      this.presenceArrayForDatabase.splice(indexInsert, 1);
    }
    let index = this.presenceArrayForDatabase.findIndex(
      (value, index, array) =>
        value.redniBroj == this.selectedPresenceRowIndex &&
        value.status != 'insert'
    );
    if (index != -1) {
      this.presenceArrayForDatabase[index].status = 'delete';
    }
    this.prisustvoTable = new MatTableDataSource(this.ELEMENT_DATA_PRESENCE);
    this.resetPresenceItemForm();
    this.getNextNumberForInsertPresence(this.ELEMENT_DATA_PRESENCE);
    this.selectedPresenceRowIndex = -1;
  }

  savePresenceItem(event) {
    event.preventDefault();
    if (this.frmWorksheet.get('prisustvo').invalid) {
      this.openDialog(true, 'Greška', 'Sva polja su obavezna!');
      return;
    }
    let presenceItem: IPresenceItem = this.createPresenceItemFromForm();
    if ((this.presenceMode as FormMode) === FormMode.insert) {
      this.insertPresenceItem(presenceItem);
    } else {
      this.updatePresenceItem(presenceItem);
    }
  }

  createPresenceItemFromForm(): IPresenceItem {
    let presenceItem: IPresenceItem = {
      redniBroj: this.frmWorksheet.get('prisustvo.redniBrojPrisustva').value,
      vrstaPrisustva: +this.frmWorksheet.get('prisustvo.vrstaPrisustva').value,
      opis: this.frmWorksheet.get('prisustvo.opisPrisustva').value,
      datum: this.frmWorksheet.get('prisustvo.datumPrisustva').value,
    };
    return presenceItem;
  }

  insertPresenceItem(presenceItem: IPresenceItem) {
    this.ELEMENT_DATA_PRESENCE.push(presenceItem);
    presenceItem.status = 'insert';
    this.presenceArrayForDatabase.push(presenceItem);
    this.prisustvoTable = new MatTableDataSource(this.ELEMENT_DATA_PRESENCE);
    this.openDialog(
      false,
      'Obaveštenje',
      'Uspešno ste uneli novu stavku prisustva!'
    );
    this.resetPresenceItemForm();
    this.getNextNumberForInsertPresence(this.ELEMENT_DATA_PRESENCE);
  }

  updatePresenceItem(presenceItem: IPresenceItem) {
    this.ELEMENT_DATA_PRESENCE[this.selectedPresenceRowIndex - 1] =
      presenceItem;
    presenceItem.status = 'update';
    let index = this.presenceArrayForDatabase.findIndex(
      (value, index, array) =>
        value.redniBroj == this.selectedPresenceRowIndex &&
        value.status != 'delete'
    );
    if (index != -1) {
      this.presenceArrayForDatabase[index] = presenceItem;
    }
    this.prisustvoTable = new MatTableDataSource(this.ELEMENT_DATA_PRESENCE);
    this.openDialog(
      false,
      'Obaveštenje',
      'Uspešno ste izmenili stavku prisustva!'
    );
    this.resetPresenceItemForm();
    this.getNextNumberForInsertPresence(this.ELEMENT_DATA_PRESENCE);
  }

  resetPresenceItemForm() {
    this.presenceMode = FormMode.insert;
    this.selectedPresenceRowIndex = -1;
    this.frmWorksheet.get('prisustvo.redniBrojPrisustva').setValue(null);
    this.frmWorksheet.get('prisustvo.vrstaPrisustva').setValue('0');
    this.frmWorksheet.get('prisustvo.opisPrisustva').reset();
    this.frmWorksheet.get('prisustvo.datumPrisustva').setValue(new Date());
  }

  highlightAbsenceItem(row) {
    if (this.selectedAbsenceRowIndex == row.redniBroj) {
      this.selectedAbsenceRowIndex = -1;
      this.resetAbsenceItemForm();
      this.getNextNumberForInsertAbsence(this.ELEMENT_DATA_ABSENCE);
    } else {
      this.abseceneMode = FormMode.update;
      this.selectedAbsenceRowIndex = row.redniBroj;
      this.frmWorksheet
        .get('odsustvo.redniBrojOdsustva')
        .setValue(row.redniBroj);
      this.frmWorksheet
        .get('odsustvo.vrstaOdsustva')
        .setValue(row.vrstaOdsustva);
      this.frmWorksheet.get('odsustvo.brojOdluke').setValue(row.brojOdluke);
      this.frmWorksheet.get('odsustvo.datumOd').setValue(row.datumOd);
      this.frmWorksheet.get('odsustvo.datumDo').setValue(row.datumDo);
    }
  }

  deleteAbsenceItem(event) {
    event.preventDefault();
    if (this.selectedAbsenceRowIndex == -1) {
      this.openDialog(true, 'Greška', 'Morate odabrati neki red!');
      return;
    }
    this.ELEMENT_DATA_ABSENCE = this.ELEMENT_DATA_ABSENCE.filter(
      (value, index, array) => value.redniBroj != this.selectedAbsenceRowIndex
    );
    for (let i = 0; i < this.ELEMENT_DATA_ABSENCE.length; i++) {
      this.ELEMENT_DATA_ABSENCE[i].redniBroj = i + 1;
    }
    let indexInsert = this.absenceArrayForDatabase.findIndex(
      (value, index, array) =>
        value.redniBroj == this.selectedAbsenceRowIndex &&
        value.status == 'insert'
    );
    if (indexInsert != -1) {
      this.absenceArrayForDatabase.splice(indexInsert, 1);
    }
    let index = this.absenceArrayForDatabase.findIndex(
      (value, index, array) =>
        value.redniBroj == this.selectedAbsenceRowIndex &&
        value.status != 'insert'
    );
    if (index != -1) {
      this.absenceArrayForDatabase[index].status = 'delete';
    }
    this.odsustvoTable = new MatTableDataSource(this.ELEMENT_DATA_ABSENCE);
    this.resetAbsenceItemForm();
    this.getNextNumberForInsertAbsence(this.ELEMENT_DATA_ABSENCE);
    this.selectedAbsenceRowIndex = -1;
  }

  saveAbsenceItem(event) {
    event.preventDefault();
    if (this.frmWorksheet.get('odsustvo').invalid) {
      this.openDialog(true, 'Greška', 'Sva polja su obavezna!');
      return;
    }
    let datumOd = this.datepipe.transform(
      this.frmWorksheet.get('odsustvo.datumOd').value,
      'dd.MM.yyyy.'
    );
    let datumDo = this.datepipe.transform(
      this.frmWorksheet.get('odsustvo.datumDo').value,
      'dd.MM.yyyy.'
    );
    if (datumOd > datumDo) {
      this.openDialog(true, 'Greška', 'Datum od ne može biti nakon datuma do!');
      return;
    }
    let absenceItem: IAbsenceItem = this.createAbsenceItemFromForm();
    if ((this.abseceneMode as FormMode) === FormMode.insert) {
      this.insertAbsenceItem(absenceItem);
    } else {
      this.updateAbsenceItem(absenceItem);
    }
  }

  createAbsenceItemFromForm() {
    let absenceItem: IAbsenceItem = {
      redniBroj: this.frmWorksheet.get('odsustvo.redniBrojOdsustva').value,
      brojOdluke: this.frmWorksheet.get('odsustvo.brojOdluke').value,
      vrstaOdsustva: +this.frmWorksheet.get('odsustvo.vrstaOdsustva').value,
      datumOd: this.frmWorksheet.get('odsustvo.datumOd').value,
      datumDo: this.frmWorksheet.get('odsustvo.datumDo').value,
    };
    return absenceItem;
  }

  insertAbsenceItem(absenceItem: IAbsenceItem) {
    this.ELEMENT_DATA_ABSENCE.push(absenceItem);
    absenceItem.status = 'insert';
    this.absenceArrayForDatabase.push(absenceItem);
    this.odsustvoTable = new MatTableDataSource(this.ELEMENT_DATA_ABSENCE);
    this.openDialog(
      false,
      'Obaveštenje',
      'Uspešno ste uneli novu stavku odsustva!'
    );
    this.resetAbsenceItemForm();
    this.getNextNumberForInsertAbsence(this.ELEMENT_DATA_ABSENCE);
  }

  updateAbsenceItem(absenceItem: IAbsenceItem) {
    this.ELEMENT_DATA_ABSENCE[this.selectedAbsenceRowIndex - 1] = absenceItem;
    absenceItem.status = 'update';
    let index = this.absenceArrayForDatabase.findIndex(
      (value, index, array) =>
        value.redniBroj == this.selectedAbsenceRowIndex &&
        value.status != 'delete'
    );
    if (index != -1) {
      this.absenceArrayForDatabase[index] = absenceItem;
    }
    this.odsustvoTable = new MatTableDataSource(this.ELEMENT_DATA_ABSENCE);
    this.openDialog(
      false,
      'Obaveštenje',
      'Uspešno ste izmenili stavku odsustva!'
    );
    this.resetAbsenceItemForm();
    this.getNextNumberForInsertAbsence(this.ELEMENT_DATA_ABSENCE);
  }

  resetAbsenceItemForm() {
    this.abseceneMode = FormMode.insert;
    this.selectedAbsenceRowIndex = -1;
    this.frmWorksheet.get('odsustvo.redniBrojOdsustva').setValue(null);
    this.frmWorksheet.get('odsustvo.vrstaOdsustva').setValue('0');
    this.frmWorksheet.get('odsustvo.brojOdluke').reset();
    this.frmWorksheet.get('odsustvo.datumOd').setValue(new Date());
    this.frmWorksheet.get('odsustvo.datumDo').setValue(new Date());
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
    if (event) {
      event.preventDefault();
    }
    this.worksheetTitle = 'Unos radne liste';
    this.currentWorker = null;
    this.frmWorksheetMode = FormMode.insert;
    this.frmWorksheet.reset();
    this.frmWorksheet.get('prisustvo.vrstaPrisustva').setValue('0');
    this.frmWorksheet.get('odsustvo.vrstaOdsustva').setValue('0');
    this.frmWorksheet.get('prisustvo.datumPrisustva').setValue(new Date());
    this.frmWorksheet.get('odsustvo.datumOd').setValue(new Date());
    this.frmWorksheet.get('odsustvo.datumDo').setValue(new Date());
    this.ELEMENT_DATA_WORKER = [];
    this.radnikTable = new MatTableDataSource(this.ELEMENT_DATA_WORKER);
    this.ELEMENT_DATA_PRESENCE = [];
    this.prisustvoTable = new MatTableDataSource(this.ELEMENT_DATA_PRESENCE);
    this.ELEMENT_DATA_ABSENCE = [];
    this.odsustvoTable = new MatTableDataSource(this.ELEMENT_DATA_ABSENCE);
    this.selectedPresenceRowIndex = -1;
    this.selectedAbsenceRowIndex = -1;
    this.presenceMode = FormMode.insert;
    this.abseceneMode = FormMode.insert;
    this.nextRedniBrojPrisustvo = 1;
    this.nextRedniBrojOdsustvo = 1;
  }

  saveWorksheet(event) {
    event.preventDefault();
    if (this.frmWorksheet.get('sifraRadneListe').invalid) {
      this.openDialog(true, 'Greška', 'Morate uneti radnu listu!');
      return;
    }
    if (this.frmWorksheet.get('sifraRadnika').invalid) {
      this.openDialog(true, 'Greška', 'Morate uneti radnika!');
      return;
    }
    if (
      this.ELEMENT_DATA_PRESENCE.length === 0 &&
      this.ELEMENT_DATA_ABSENCE.length === 0
    ) {
      this.openDialog(
        true,
        'Greška',
        'Morate uneti barem jednu stavku prisustva ili odsustva!'
      );
      return;
    }
    let worksheet: IWorksheet = this.createWorksheetFromForm();
    if ((this.frmWorksheetMode as FormMode) === FormMode.insert) {
      this.insertWorksheet(worksheet);
    } else {
      this.updateWorksheet(worksheet);
    }
  }

  insertWorksheet(worksheet: IWorksheet) {
    this.worksheetService.insertWorksheet(worksheet).subscribe({
      next: (response) => {
        if (response) {
          this.resetAllFields(null);
          this.openDialog(
            false,
            'Obaveštenje',
            'Uspešno ste uneli novu radnu listu!'
          );
        } else {
          this.openDialog(
            true,
            'Greška',
            'Došlo je do greške prilikom unosa radne liste!'
          );
        }
      },
    });
  }

  updateWorksheet(worksheet: IWorksheet) {
    console.log(worksheet);
    this.worksheetService.updateWorksheet(worksheet).subscribe({
      next: (response) => {
        if (response) {
          this.resetAllFields(null);
          this.openDialog(
            false,
            'Obaveštenje',
            'Uspešno ste izmenili radnu listu!'
          );
        } else {
          this.openDialog(
            true,
            'Greška',
            'Došlo je do greške prilikom izmene radne liste!'
          );
        }
      },
    });
  }

  createWorksheetFromForm(): IWorksheet {
    let worksheet: IWorksheet = {
      sifra: this.frmWorksheet.get('sifraRadneListe').value,
      worker: this.currentWorker,
      presenceItemList: this.presenceArrayForDatabase,
      absenceItemList: this.absenceArrayForDatabase,
    };
    return worksheet;
  }

  redirectToMainPage() {
    this.router.navigate(['/main-page']);
  }
}
