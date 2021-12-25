import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-radna-lista',
  templateUrl: './radna-lista.component.html',
  styleUrls: ['./radna-lista.component.css']
})
export class RadnaListaComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {}

  redirectToMainPage(){
    this.router.navigate(['/main-page']);

  }

}
