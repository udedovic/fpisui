import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './fpisui/main-page/main-page.component';
import { ProizvodComponent } from './fpisui/proizvod/proizvod.component';
import { RadnaListaComponent } from './fpisui/radna-lista/radna-lista.component';

const routes: Routes = [
  {
    path: 'proizvod',
    component: ProizvodComponent,
  },
  {
    path: 'radna-lista',
    component: RadnaListaComponent,
  },
  {
    path: 'main-page',
    component: MainPageComponent,
  },
  {
    path: '',
    redirectTo: '/main-page',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/main-page',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
