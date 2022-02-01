import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserLogin } from 'src/app/models/UserLogin';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/AuthService/auth.service';
import { empty } from 'rxjs';

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

  constructor(
    public authService: AuthService,
    public router: Router
    , private toastr: ToastrService
    , public fb: FormBuilder) { }

  ngOnInit() {
    this.validation();
    if (localStorage.getItem('token') !== null) {
      this.router.navigate(['/listaAdms']);
    }
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
  }

  login() {
    this.usuario = Object.assign({}, this.registerForm.value);
    this.authService.login(this.usuario)
      .subscribe(
        () => {
          // this.router.navigate(['/agendamentosUser']);
          this.toastr.success('Logado com sucesso !');
        }, error => {
          if(error.status === 400){
            this.toastr.warning(error.error);  
          }else{
            this.toastr.error(error.error);
          }
          console.clear();
        });
  }
}