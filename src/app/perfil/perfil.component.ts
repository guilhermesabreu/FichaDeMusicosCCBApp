import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { defineLocale, ptBrLocale } from 'ngx-bootstrap/chronos';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { Pessoa } from '../models/Pessoa';
import { AuthService } from '../services/AuthService/auth.service';
import { PessoaService } from '../services/PessoaService/pessoa.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  pessoa!: Pessoa;
  idPessoa!: number;
  nomePessoaLogada!: string;
  apelidoPessoaLogada!: string;
  datePickerConfig!: Partial<BsDatepickerConfig>;
  registerForm!: FormGroup;
  instrumentos = ['viola', 'violino', 'violoncelo', 'saxofone baixo', 'saxofone tenor', 'saxofone barítono', 'saxofone alto',
    'clarinete', 'clarinete alto', 'clarinete baixo', 'fagote', 'corne ingês', 'oboe d` amore', 'flauta', 'oboé',
    'trompa', 'trombone', 'trompete', 'tuba', 'eufonio', 'flugelhorn', 'baritono'];
  _condicaoSelecionada = '';
  mostraEncarregadoLocal = false;
  mostraEncarregadoRegional = false;

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
    this.obterPessoaLogada();
    this.validation();
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
    switch (value) {
      case 'instrutor':
        this.mostraEncarregadoLocal = true; this.mostraEncarregadoRegional = true; break;
      case 'encarregado': this.registerForm.patchValue({ encarregadoLocal: '' });
        this.mostraEncarregadoRegional = true; this.mostraEncarregadoLocal = false; break;
      case 'regional': this.registerForm.patchValue({ encarregadoLocal: '', encarregadoRegional: '' });
        this.mostraEncarregadoLocal = false; this.mostraEncarregadoRegional = false; break;
    }
  }

  obterPessoaLogada() {
    this.apelidoPessoaLogada = sessionStorage.getItem('username')!;
    this.pessoaService.buscarPessoaLogada(this.apelidoPessoaLogada)
      .subscribe(
        (res: Pessoa) => {
          this.nomePessoaLogada = res.nome;
          this.idPessoa = res.id;
          this.registerForm.patchValue({
            nome: res.nome,
            encarregadoLocal: res.apelidoEncarregado,
            encarregadoRegional: res.apelidoEncRegional,
            regiao: res.regiao,
            regional: res.regional,
            celular: res.celular,
            email: res.email,
            dataNascimento: res.dataNascimento,
            dataInicio: res.dataInicio,
            comum: res.comum,
            instrumento: res.instrumento,
            condicao: res.condicao
          });
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
    this.pessoaService.buscarEncarregadoLocal(event.query)
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
    this.pessoaService.buscarEncarregadoRegional(event.query)
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

  transformDate(date: any) {
    if (typeof date === 'object') {
      return date;
    }
    else {
      var dateParts = date.split("/");
      var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
      return dateObject;
    }
  }

  removerPessoa(modalRemoverPessoa: any) {
    modalRemoverPessoa.show();
    console.log('id: ', this.idPessoa);
  }

  confirmarExclusaoPessoa(modalRemoverPessoa: any) {
    if (this.idPessoa !== null && this.idPessoa !== undefined && this.idPessoa > 0) {
      var model = { idPessoa: this.idPessoa, apelidoDonoDaFicha: this.apelidoPessoaLogada };
      this.pessoaService.excluirPessoa(this.idPessoa)
        .subscribe(
          () => {
            modalRemoverPessoa.hide();
            this.router.navigate(['/login']);
            this.toastr.success(`Seu Perfil foi Deletado com sucesso`);
          }, error => {
            if (error.status === 400) {
              this.toastr.warning(error.error);
            } else {
              this.toastr.error(error.error);
            }
            console.clear();
          });
    }
    else {
      this.toastr.error('Pessoa não localizado na base de dados.')
    }
  }

  editarPessoa() {
    var pessoa = Object.assign({}, this.registerForm.value);
    if (this.registerForm.valid) {
      console.log('pessoa: ', pessoa);
      var pessoaPut = {
        id: this.idPessoa,
        nome: pessoa.nome, encarregadoLocal: pessoa.encarregadoLocal, instrutor: pessoa.apelidoInstrutor,
        encarregadoRegional: pessoa.encarregadoRegional, regiao: pessoa.regiao,
        regional: pessoa.regional, celular: pessoa.celular, email: pessoa.email,
        dataNascimento: this.transformDate(pessoa.dataNascimento), dataInicio: this.transformDate(pessoa.dataInicio),
        comum: pessoa.comum, instrumento: pessoa.instrumento, condicao: pessoa.condicao
      };
      this.pessoaService.atualizarPessoa(pessoaPut)
        .subscribe(
          (pessoa: Pessoa) => {
            this.router.navigate(['/login']);
            this.toastr.success(`Seu Perfil foi Editado com sucesso`);
          }, error => {
            if (error.status === 400) {
              this.toastr.warning(error.error);
            } else {
              this.toastr.error(error.error);
            }
            console.clear();
          });
    } else {
      this.toastr.warning('Preencha todos os campos corretamente !');
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