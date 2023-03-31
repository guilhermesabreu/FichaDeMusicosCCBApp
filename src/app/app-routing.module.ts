import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { FichaComponent } from './ficha/ficha.component';
import { FichaAlunosComponent } from './ficha-alunos/ficha-alunos.component';
import { FichaInstrutoresComponent } from './ficha-instrutores/ficha-instrutores.component';
import { FichaEncarregadosComponent } from './ficha-encarregados/ficha-encarregados.component';
import { LoginComponent } from './login/login.component';
import { PerfilComponent } from './perfil/perfil.component';
import { RegistroPessoaComponent } from './registroPessoa/registroPessoa.component';


const routes: Routes = [
  {path: 'login', component: LoginComponent },
  {path: 'registroPessoa', component: RegistroPessoaComponent },
  {path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard], data: {permittedRoles:['INSTRUTOR', 'REGIONAL', 'ENCARREGADO']} },
  {path: 'ficha', component: FichaComponent, canActivate: [AuthGuard], data: {permittedRoles:['INSTRUTOR', 'REGIONAL', 'ENCARREGADO']} },
  {path: 'ficha-alunos', component: FichaAlunosComponent, canActivate: [AuthGuard], data: {permittedRoles:['INSTRUTOR', 
  'REGIONAL', 'ENCARREGADO']} },
  {path: 'ficha-encarregados', component: FichaEncarregadosComponent, canActivate: [AuthGuard], data: {permittedRoles:[ 'REGIONAL']} },
  {path: 'ficha-instrutores', component: FichaInstrutoresComponent, canActivate: [AuthGuard], data: {permittedRoles:['REGIONAL', 'ENCARREGADO']} },
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: '**', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }