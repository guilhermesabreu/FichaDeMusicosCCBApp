import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { defineLocale, ptBrLocale } from 'ngx-bootstrap/chronos';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { Pessoa } from '../models/Pessoa';
import { AuthService } from '../services/AuthService/auth.service';
import { PessoaService } from '../services/PessoaService/pessoa.service';

defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-registroPessoa',
  templateUrl: './registroPessoa.component.html',
  styleUrls: ['./registroPessoa.component.css']
})
export class RegistroPessoaComponent implements OnInit {

  pessoa!: Pessoa;
  datePickerConfig!: Partial<BsDatepickerConfig>;
  registerForm!: FormGroup;
  instrumentos = ['viola', 'violino', 'violoncelo', 'saxofone baixo', 'saxofone tenor', 'saxofone barítono', 'saxofone alto',
    'clarinete', 'clarinete alto', 'clarinete baixo', 'fagote', 'corne ingês', 'oboe d` amore', 'flauta', 'oboé',
    'trompa', 'trombone', 'trompete', 'tuba', 'eufonio', 'flugelhorn', 'baritono'];
  _condicaoSelecionada = '';
  mostraEncarregadoLocal = false;
  mostraEncarregadoRegional = false;
  apelidoPessoaLogada!: string;
  results!: string[];

  constructor(
    public authService: AuthService,
    private localeService: BsLocaleService,
    public pessoaService: PessoaService,
    public router: Router
    , private toastr: ToastrService
    , public fb: FormBuilder) {
    localeService.use('pt-br');
    this.datePickerConfig = Object.assign({}, { containerClass: 'theme-blue' });
  }

  ngOnInit() {
    this.despertarServidor();
    this.validation();
    this.apelidoPessoaLogada = sessionStorage.getItem('username')!;
  }

  despertarServidor(){
    this.authService.despertarServidor()
    .subscribe(
      () => {
      }, error => {
          this.toastr.error('Servidor indisponível !');
      });
  }

  get condicaoSelecionada(): string {
    return this._condicaoSelecionada;
  }

  set condicaoSelecionada(value: string) {
    switch (value) {
      case 'instrutor': 
      this.mostraEncarregadoLocal = true; this.mostraEncarregadoRegional = true; break;
      case 'encarregado': this.registerForm.patchValue({encarregadoLocal: '' });
      this.mostraEncarregadoRegional = true; this.mostraEncarregadoLocal = false; break;
      case 'regional': this.registerForm.patchValue({encarregadoLocal: '', encarregadoRegional: '' });
      this.mostraEncarregadoLocal = false; this.mostraEncarregadoRegional = false; break;
    }
  }

  autoCompleteEncarregadoLocal(event: any) {
    this.pessoaService.buscarEncarregadoLocal(event.query, '')
      .subscribe(
        (res: any) => {
          this.results = res;
        }, error => {
          if (error.status === 400) {
            this.toastr.warning(error.error);
          } else {
            this.toastr.error(error.error);
          }
          console.clear();
        });
  }

  autoCompleteEncarregadoRegional(event: any) {
    this.pessoaService.buscarEncarregadoRegional(event.query, '')
      .subscribe(
        (res: any) => {
          this.results = res;
        }, error => {
          if (error.status === 400) {
            this.toastr.warning(error.error);
          } else {
            this.toastr.error(error.error);
          }
          console.clear();
        });
  }

  validation() {
    this.registerForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(10)]],
      encarregadoLocal: [''],
      encarregadoRegional: [''],
      regiao: ['', [Validators.required, Validators.pattern('^.*\- ?[a-zA-Z]*')]],
      regional: ['', Validators.required],
      celular: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dataNascimento: ['', Validators.required],
      dataInicio: ['', Validators.required],
      comum: ['', Validators.required],
      instrumento: ['', Validators.required],
      condicao: ['', Validators.required],
      userName: ['', Validators.required],
      passwords: this.fb.group({
        password: ['', [Validators.required, Validators.minLength(4)]],
        confirmPassword: ['', Validators.required]
      }, { validator: this.compararSenhas })
    });
  }
  
  registrarPessoa() {
    if (this.registerForm.valid) {
      var dadosForm = Object.assign({}, this.registerForm.value);
      this.pessoa = dadosForm;
      this.pessoa.apelidoInstrutor = dadosForm.condicao === 'instrutor' ? dadosForm.userName : '';
      this.pessoa.password = dadosForm.passwords.password;
      this.pessoaService.registroPessoa(this.pessoa)
        .subscribe(
          () => {
            this.toastr.success('Pessoa registrada com sucesso !');
            this.router.navigate(['/login']);
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

  compararSenhas(fb: FormGroup) {
    const confirmSenhaCtrl = fb.get('confirmPassword');
    if (confirmSenhaCtrl!.errors == null || 'mismatch' in confirmSenhaCtrl!.errors) {
      if (fb.get('password')!.value !== confirmSenhaCtrl!.value) {
        confirmSenhaCtrl!.setErrors({ mismatch: true });
      } else {
        confirmSenhaCtrl!.setErrors(null);
      }
    }
  }

  visualizarPrimeiraSenha() {
    const password = document.querySelector('#senha1');
    const toggle = document.querySelector('#toggle1');
    const type = password!.getAttribute('type') === 'password' ? 'text' : 'password';
    password!.setAttribute('type', type);
    toggle!.classList.toggle('fa-eye-slash');
  }

  visualizarSegundaSenha() {
    const password = document.querySelector('#senha2');
    const toggle = document.querySelector('#toggle2');
    const type = password!.getAttribute('type') === 'password' ? 'text' : 'password';
    password!.setAttribute('type', type);
    toggle!.classList.toggle('fa-eye-slash');
  }

}
