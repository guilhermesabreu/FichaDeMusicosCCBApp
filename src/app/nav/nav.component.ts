import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/AuthService/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Pessoa } from '../models/Pessoa';
import { PessoaService } from '../services/PessoaService/pessoa.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  admins: Pessoa[] = [];
  perfil!: string;

  constructor(private authService: AuthService
    , public router: Router
    , public pessoaService: PessoaService
    , private toastr: ToastrService) { }

  ngOnInit() {
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  logOut() {
    localStorage.removeItem('token');
    this.toastr.show('Log Out');
    this.router.navigate(['/login']);
  }

  entrar() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  userName() {
    return sessionStorage.getItem('username');
  }

  showMenu() {
    return this.router.url !== "/login";
  }

  showSubItem(): string {
    return sessionStorage.getItem('role')!.toString();
  }

  fichaInstrutores() {
    this.router.navigate(['/ficha-instrutores']);
  }

  fichaAlunos() {
    this.router.navigate(['/ficha-alunos']);
  }

  fichaEncarregados() {
    this.router.navigate(['/ficha-encarregados']);
  }

  perfilPessoa() {
    this.router.navigate(['/perfil']);
  }

  showButton() {
    var urlCorreta = this.router.url.indexOf("agendamentos");
    if (urlCorreta > 0) {
      return true;
    }
    else {
      return false;
    }
  }
}
