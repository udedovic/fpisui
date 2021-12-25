import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proizvod',
  templateUrl: './proizvod.component.html',
  styleUrls: ['./proizvod.component.css'],
})
export class ProizvodComponent implements OnInit {
  productTitle: string = 'Unos proizvoda';
  frmProizvod: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder) {}

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

  createNewProduct() {}

  findProduct() {}

  changeProduct() {}

  resetAllFields() {
    this.frmProizvod.reset();
    this.productTitle = 'Unos proizvoda';
  }

  saveProduct() {}

  redirectToMainPage() {
    this.router.navigate(['/main-page']);
  }
}
