import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MainPageComponent } from './main-page/main-page.component';
import { RadnaListaComponent } from './radna-lista/radna-lista.component';
import { ProizvodComponent } from './proizvod/proizvod.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SharedModule } from '../shared-module/shared.module';
import { InformationDialogComponent } from '../shared-module/information-dialog/information-dialog.component';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';

@NgModule({
  declarations: [
    MainPageComponent,
    RadnaListaComponent,
    ProizvodComponent,
    InformationDialogComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    HttpClientModule,
  ],
  providers: [
    MatDatepickerModule,
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
})
export class FpisuiModule {}
