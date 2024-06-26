import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { defineLocale, ptBrLocale } from 'ngx-bootstrap/chronos';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { Pessoa } from '../models/Pessoa';
import { Regiao } from '../models/Regiao';
import { AuthService } from '../services/AuthService/auth.service';
import { LocalidadeService } from '../services/LocalidadeService/Localidade.service';
import { PessoaService } from '../services/PessoaService/pessoa.service';

defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-registroPessoa',
  templateUrl: './registroPessoa.component.html',
  styleUrls: ['./registroPessoa.component.css']
})
export class RegistroPessoaComponent implements OnInit {

  pessoa!: Pessoa;
  pessoaPesquisada!: Pessoa;
  datePickerConfig!: Partial<BsDatepickerConfig>;
  registerForm!: FormGroup;

  instrumentos = ['baritono', 'clarinete', 'eufonio', 'clarinete alto', 'clarinete baixo', 'corne ingês', 'fagote', 'flauta',
    'flugelhorn', 'oboé', 'oboe d` amore', 'saxofone alto', 'saxofone baixo', 'saxofone barítono', 'saxofone tenor',
    'trombone', 'trompa', 'trompete', 'tuba', 'violino', 'viola', 'violoncelo'];
  _condicaoSelecionada = '';
  mostraEncarregadoLocal = false;
  mostraEncarregadoRegional = false;
  mostraComum = false;
  mostraRegiao = false;
  mostraRegional = false;
  apelidoPessoaLogada!: string;
  results!: string[];

  constructor(
    public authService: AuthService,
    private localeService: BsLocaleService,
    public pessoaService: PessoaService,
    public localidadeService: LocalidadeService,
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

  despertarServidor() {
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
    this.exibirOuEsconderCampos(value);
  }

  exibirOuEsconderCampos(value: string) {
    this.registerForm.patchValue({ encarregadoLocal: '', encarregadoRegional: '', comum: '', regiao: '', regional: '' });
    switch (value) {
      case 'instrutor':
        this.mostraEncarregadoLocal = true; this.mostraEncarregadoRegional = false;
        this.mostraComum = false; this.mostraRegiao = false; this.mostraRegional = false;
        break;
      case 'encarregado':
        this.mostraEncarregadoRegional = true; this.mostraEncarregadoLocal = false;
        this.mostraComum = true; this.mostraRegiao = false; this.mostraRegional = false;
        break;
      case 'regional':
        this.mostraEncarregadoLocal = false; this.mostraEncarregadoRegional = false;
        this.mostraComum = false; this.mostraRegiao = true; this.mostraRegional = true;
        break;
    }
  }

  preencherCampos(pessoa: Pessoa) {
    switch (pessoa.condicao.toLocaleLowerCase()) {
      case 'encarregado':
        this.registerForm.patchValue({ encarregadoRegional: pessoa.apelidoEncRegional, comum: pessoa.comum, regiao: pessoa.regiao, regional: pessoa.regional });
        break;
      case 'regional':
        this.registerForm.patchValue({ regiao: pessoa.regiao, regional: pessoa.regional });
        break;
    }
  }



  obterInformacoesEncarregado(event: any) {
    this.pessoaService.buscarEncarregadoLocal(event, '')
      .subscribe(
        (res: Pessoa[]) => {
          this.pessoaPesquisada = res[0];
          this.preencherCampos(this.pessoaPesquisada);
        }, error => {
          if (error.status === 400) {
            this.toastr.warning(error.error);
          } else {
            this.toastr.error(error.error);
          }
          console.clear();
        });
  }

  obterInformacoesEncarregadoRegional(event: any) {
    this.pessoaService.buscarEncarregadoRegional(event, '')
      .subscribe(
        (res: Pessoa[]) => {
          this.pessoaPesquisada = res[0];
          this.preencherCampos(this.pessoaPesquisada);
        }, error => {
          if (error.status === 400) {
            this.toastr.warning(error.error);
          } else {
            this.toastr.error(error.error);
          }
          console.clear();
        });
  }

  autoCompleteEncarregadoLocal(event: any) {
    this.pessoaService.buscarEncarregadoLocal(event.query, '')
      .subscribe(
        (res: Pessoa[]) => {
          this.results = res.map(item => item.nome);
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
        (res: Pessoa[]) => {
          this.results = res.map(item => item.nome);
        }, error => {
          if (error.status === 400) {
            this.toastr.warning(error.error);
          } else {
            this.toastr.error(error.error);
          }
          console.clear();
        });
  }

  autoCompleteRegiao(event: any) {
    this.localidadeService.buscarRegioes(event.query)
      .subscribe(
        (res: string[]) => {
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

  autoCompleteRegional(event: any) {
    this.localidadeService.buscarRegionais(event.query)
      .subscribe(
        (res: string[]) => {
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

  autoCompleteComum(event: any) {
    this.localidadeService.buscarComuns(event.query)
      .subscribe(
        (res: string[]) => {
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
      regiao: [''],
      regional: [''],
      celular: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dataNascimento: [''],
      dataInicio: [''],
      comum: [''],
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
