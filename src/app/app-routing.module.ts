import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistroPessoaComponent } from './registroPessoa/registroPessoa.component';


const routes: Routes = [
  {path: 'login', component: LoginComponent },
  {path: 'registroPessoa', component: RegistroPessoaComponent },
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: '**', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }