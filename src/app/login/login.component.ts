import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserLogin } from 'src/app/models/UserLogin';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/AuthService/auth.service';
import { PessoaService } from '../services/PessoaService/pessoa.service';
import { Pessoa } from '../models/Pessoa';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  titulo = 'Login';
  usuario!: UserLogin;
  id!: string;
  public idValue: any;
  registerForm!: FormGroup;
  registerFormSenha!: FormGroup;

  constructor(
    public authService: AuthService,
    public pessoaService: PessoaService,
    public router: Router
    , private toastr: ToastrService
    , public fb: FormBuilder) { }

  ngOnInit() {
    this.despertarServidor();
    this.validation();
    if (localStorage.getItem('token') !== null) {
      this.router.navigate(['/login']);
    }
  }

  despertarServidor() {
    this.authService.despertarServidor()
      .subscribe(
        () => {
        }, error => {
          this.toastr.error('Servidor indisponível !');
        });
  }

  visualizarSenha() {
    const password = document.querySelector('#senha');
    const toggle = document.querySelector('#toggleSenha');
    const type = password!.getAttribute('type') === 'password' ? 'text' : 'password';
    password!.setAttribute('type', type);
    toggle!.classList.toggle('fa-eye-slash');

  }

  validation() {
    this.registerForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.registerFormSenha = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    })
  }

  recuperarSenha(modalRecuperarEmail: any) {
    
    modalRecuperarEmail.show();
  }

  recuperarSenhaPorEmail(registerFormSenha: any) {
    var pessoa = Object.assign({}, this.registerFormSenha.value);
    if (this.registerFormSenha.valid) {
      var recuperarSenhaPost = { email: pessoa.email };
      this.pessoaService.recuperarSenha(recuperarSenhaPost)
        .subscribe(
          (pessoa: Pessoa) => {
            this.toastr.success('Usuário e Senha enviada no seu e-mail.');
            registerFormSenha.hide();
          }, error => {
            if (error.status === 400) {
              this.toastr.warning(error.error);
            } else {
              this.toastr.error(error.error);
            }
            console.clear();
          });
    }
  }

  login() {
    this.usuario = Object.assign({}, this.registerForm.value);
    this.authService.login(this.usuario)
      .subscribe(
        () => {
          this.toastr.success('Logado com sucesso !');
          this.router.navigate(['/ficha']);
        }, error => {
          if (error.status === 400) {
            this.toastr.warning(error.error);
          } else {
            this.toastr.error(error.error);
          }
          console.clear();
        });
  }
}