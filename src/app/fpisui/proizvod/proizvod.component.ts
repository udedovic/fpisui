import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InformationDialogComponent } from 'src/app/shared-module/information-dialog/information-dialog.component';
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
          this.frmProizvod.setValue(product);
        } else {
          this.openDialog(true, 'Greška', 'Uneli ste nepostojeći proizvod!');
        }
      });
  }

  changeProduct() {
    if (this.frmProizvod.invalid) {
      this.openDialog(true, 'Greška', 'Sva polja su obavezna!');
      return;
    }
    let product: IProduct = this.createProductFromForm();
    this.productService.updateProduct(product).subscribe({
      next: (response) => {
        if (response) {
          this.openDialog(
            false,
            'Obaveštenje',
            'Uspešno ste izmenili proizvod!'
          );
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

  saveProduct() {
    if (this.frmProizvod.invalid) {
      this.openDialog(true, 'Greška', 'Sva polja su obavezna!');
      return;
    }
    let product: IProduct = this.createProductFromForm();
    this.productService.insertProduct(product).subscribe({
      next: (response) => {
        if (response) {
          this.openDialog(
            false,
            'Obaveštenje',
            'Uspešno ste uneli novi proizvod!'
          );
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

  createProductFromForm() {
    return {
      sifraProizvoda: this.frmProizvod.get('sifraProizvoda').value,
      duzinaProizvoda: this.frmProizvod.get('duzinaProizvoda').value,
      sirinaProizvoda: this.frmProizvod.get('sirinaProizvoda').value,
      visinaProizvoda: this.frmProizvod.get('visinaProizvoda').value,
      debljinaStakla: this.frmProizvod.get('debljinaStakla').value,
    };
  }

  resetAllFields() {
    this.frmProizvod.reset();
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
