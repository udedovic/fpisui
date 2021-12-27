import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InformationDialogComponent } from 'src/app/shared-module/information-dialog/information-dialog.component';
import { FormMode } from 'src/app/utils/form-mode';
import { IProduct } from 'src/app/utils/interfaces/product';
import { ProductService } from 'src/app/utils/services/product.service';

@Component({
  selector: 'app-proizvod',
  templateUrl: './proizvod.component.html',
  styleUrls: ['./proizvod.component.css'],
})
export class ProizvodComponent implements OnInit {
  productTitle: string = 'Unos proizvoda';
  frmProizvod: FormGroup;
  frmProizvodMode: FormMode = FormMode.insert;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.frmProizvod = this.formBuilder.group({
      sifraProizvoda: [null, Validators.required],
      duzinaProizvoda: [null, Validators.required],
      sirinaProizvoda: [null, Validators.required],
      visinaProizvoda: [null, Validators.required],
      debljinaStakla: [null, Validators.required],
    });
  }

  createNewProduct() {
    this.productService.getNewId().subscribe((id) => {
      this.resetAllFields();
      this.frmProizvodMode = FormMode.insert;
      this.productTitle = "Unos proizvoda";
      this.frmProizvod.get('sifraProizvoda').setValue(id);
    });
  }

  findProduct() {
    if (this.frmProizvod.get('sifraProizvoda').invalid) {
      return;
    }
    this.productService
      .findProduct(this.frmProizvod.get('sifraProizvoda').value)
      .subscribe((product) => {
        if (product) {
          this.frmProizvodMode = FormMode.update;
          this.productTitle = "Izmena proizvoda";
          this.frmProizvod.setValue(product);
        } else {
          this.productTitle = "Unos proizvoda";
          this.frmProizvodMode = FormMode.insert;
          this.openDialog(true, 'Greška', 'Uneli ste nepostojeći proizvod!');
        }
      });
  }

  saveProduct() {
    if (this.frmProizvod.invalid) {
      this.openDialog(true, 'Greška', 'Sva polja su obavezna!');
      return;
    }
    let product: IProduct = this.createProductFromForm();
    if ((this.frmProizvodMode as FormMode) === FormMode.insert) {
      this.insertProduct(product);
    } else {
      this.updateProduct(product);
    }
  }

  createProductFromForm() {
    return {
      sifraProizvoda: this.frmProizvod.get('sifraProizvoda').value,
      duzinaProizvoda: this.frmProizvod.get('duzinaProizvoda').value,
      sirinaProizvoda: this.frmProizvod.get('sirinaProizvoda').value,
      visinaProizvoda: this.frmProizvod.get('visinaProizvoda').value,
      debljinaStakla: this.frmProizvod.get('debljinaStakla').value,
    };
  }

  insertProduct(product: IProduct) {
    this.productService.insertProduct(product).subscribe({
      next: (response) => {
        if (response) {
          this.openDialog(
            false,
            'Obaveštenje',
            'Uspešno ste uneli novi proizvod!'
          );
          this.resetAllFields();
        } else {
          this.openDialog(
            true,
            'Greška',
            'Došlo je do greške prilikom čuvanja proizvoda!'
          );
        }
      },
    });
  }

  updateProduct(product: IProduct) {
    this.productService.updateProduct(product).subscribe({
      next: (response) => {
        if (response) {
          this.openDialog(
            false,
            'Obaveštenje',
            'Uspešno ste izmenili proizvod!'
          );
          this.resetAllFields();
        } else {
          this.openDialog(
            true,
            'Greška',
            'Došlo je do greške prilikom čuvanja proizvoda!'
          );
        }
      },
    });
  }

  resetAllFields() {
    this.frmProizvod.reset();
    this.frmProizvodMode = FormMode.insert;
    this.productTitle = 'Unos proizvoda';
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

  redirectToMainPage() {
    this.router.navigate(['/main-page']);
  }
}
