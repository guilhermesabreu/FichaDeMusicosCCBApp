import { Component, Injectable, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EventEmitterService } from '../event-emmiter/event-emitter.service';
import { Pessoa } from '../models/Pessoa';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PessoaService } from '../services/PessoaService/pessoa.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ocorrencia } from '../models/Ocorrencia';
import { Hino } from '../models/Hino';
import { HinoService } from '../services/HinoService/Hino.service';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { OcorrenciaService } from '../services/OcorrenciaService/Ocorrencia.service';
import { DatePipe } from '@angular/common';
import { defineLocale, ptBrLocale } from 'ngx-bootstrap/chronos';
import { Router, ActivatedRoute } from '@angular/router';
defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-ficha',
  templateUrl: './ficha-instrutores.component.html',
  styleUrls: ['./ficha-instrutores.component.css']
})

@Injectable()
export class FichaInstrutoresComponent implements OnInit {

  nomePessoa!: string;
  condicaoTitulo!: string;
  pessoaLogada!: Pessoa;
  pessoa!: Pessoa;
  pessoas!: Pessoa[];
  hino!: Hino;
  ocorrencia!: Ocorrencia;
  ocorrencias!: Ocorrencia[];
  alfabetoPessoas!: string[];
  registerFormInstrutor!: FormGroup;
  registerFormOcorrencia!: FormGroup;
  registerFormHino!: FormGroup;
  hinoParaExcluir = '';
  ocorrenciaParaExcluir = '';
  idHino!: number;
  idPessoa!: number;
  idOcorrencia!: number;
  exibeOcorrencia!: boolean;
  opcaoMudancaOcorrencia!: string;
  results!: string[];
  modoSalvar = 'post';
  condicaoCarousel!: string;
  apelidoPessoaLogada!: string;
  condicaoPessoaLogada = '';

  datePickerConfig!: Partial<BsDatepickerConfig>;

  constructor(
    public dateFormatPipe: DatePipe,
    private fb: FormBuilder,
    public router: Router,
    private eventEmitterService: EventEmitterService,
    public pessoaService: PessoaService,
    public hinoService: HinoService,
    public ocorrenciaService: OcorrenciaService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private localeService: BsLocaleService,
  ) {
    localeService.use('pt-br');
    this.datePickerConfig = Object.assign({}, { adaptivePosition: true, containerClass: 'theme-blue', dateInputFormat: 'DD/MM/YYYY' });
  }

  ngOnInit() {
    this.validation();
    this.condicaoCarousel = 'INSTRUTOR';
    this.condicaoTitulo = 'Instrutores';
    this.listarMusicos(this.condicaoCarousel);
    this.obterPessoaLogada();
  }

  //////////////////Verificador de ForBuilder////////////////
  findInvalidControls(f: FormGroup) {
    const invalid = [];
    const controls = f.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  validation() {
    this.registerFormInstrutor = this.fb.group({
      id: [''],
      nome: ['', [Validators.required, Validators.minLength(10)]],
      alunoPesquisado: [''],
      instrutor: [''],
      encarregadoLocal: [''],
      encarregadoRegional: [''],
      regiao: ['', [Validators.required, Validators.pattern('^.*\- ?[a-zA-Z]*')]],
      regional: ['', Validators.required],
      celular: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dataNascimento: ['', Validators.required],
      dataInicio: ['', Validators.required],
      comum: [''],
      instrumento: ['', Validators.required],
      condicao: ['', Validators.required],
      ocorrencias: [''],
      hinos: ['']
    });

    this.registerFormOcorrencia = this.fb.group({
      idOcorrencia: [''],
      dataOcorrencia: ['', Validators.required],
      numeroLicao: ['', Validators.required],
      nomeMetodo: ['', Validators.required],
      observacaoInstrutor: ['', Validators.required]
    });

    this.registerFormHino = this.fb.group({
      numeroHino: ['', Validators.required],
      vozHino: ['', Validators.required],
    });
  }

  ////////////////////////////////////Listas///////////////////////////////////////
  instrumentos = ['baritono', 'clarinete', 'eufonio', 'clarinete alto', 'clarinete baixo', 'corne ingês', 'fagote', 'flauta',
  'flugelhorn', 'oboé', 'oboe d` amore', 'saxofone alto', 'saxofone baixo', 'saxofone barítono', 'saxofone tenor',
  'trombone', 'trompa', 'trompete', 'tuba', 'violino', 'viola', 'violoncelo'];

  autoCompleteEncarregadoLocal(event: any) {
    this.pessoaService.buscarEncarregadoLocal(event.query, this.apelidoPessoaLogada)
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


  obterPessoaLogada() {
    this.pessoaService.buscarPessoaLogada(this.apelidoPessoaLogada)
      .subscribe(
        (res: Pessoa) => {
          this.pessoaLogada = res;
          this.condicaoPessoaLogada = res.condicao;
        }, error => {
          if (error.status === 400) {
            this.toastr.warning(error.error);
          } else {
            this.toastr.error(error.error);
          }
          console.clear();
        });
  }

  listarOcorrenciasPorAluno(pessoa: Pessoa): Ocorrencia[] {
    this.pessoa = pessoa;
    this.ocorrencias = this.pessoa.ocorrencias;
    this.exibeOcorrencia = this.ocorrencias === undefined ? false : true;
    return this.ocorrencias;
  }

  toISOFormatDataHora(dateTimeString: string) {
    const [date, time] = dateTimeString.split(' ');
    const [DD, MM, YYYY] = date.split('/');
    return `${MM}/${DD}/${YYYY}`;
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

  transformDateInvertida(data: any) {
    var dataConvertida = new Date(data);
    if (dataConvertida.toString() == 'Invalid Date')
      return data;

    return this.dateFormatPipe.transform(data, 'MM/dd/yyyy');
  }

  listarHinosPorAluno(pessoa: Pessoa): Hino[] {
    return pessoa.hinos;
  }

  listarMusicos(opcaoRole: string) {
    var condicao = sessionStorage.getItem('role');
    this.apelidoPessoaLogada = sessionStorage.getItem('username')!;
    var lParametros = "";
    lParametros += condicao === 'ENCARREGADO' ? 'ApelidoEncarregado=' + this.apelidoPessoaLogada
      : condicao === 'REGIONAL' ? 'ApelidoEncarregadoRegional=' + this.apelidoPessoaLogada
        : condicao === 'INSTRUTOR' ? 'ApelidoInstrutor=' + this.apelidoPessoaLogada : '';
    lParametros += opcaoRole === '' || opcaoRole === undefined || opcaoRole === null ? '&Condicao=ALUNO' : '&Condicao=' + opcaoRole;
    this.pessoaService.listaDeMusicos(lParametros)
      .subscribe(
        (res: Pessoa[]) => {
          this.pessoas = res;
          this.alfabetoPessoas = this.pessoas.map(item => item.nome.substring(0, 1)).filter((value, index, self) => self.indexOf(value) === index);
        }, error => {
          if (error.status === 400) {
            this.toastr.warning(error.error);
          } else {
            this.toastr.error(error.error);
          }
          console.clear();
        });
  }

  //////////////////////////////////Dados Pessoais////////////////////////////////
  //////////////////////////////////Adição////////////////////////////////////////
  cadastrarPessoa(modalDadosPessoais: any) {
    this.registerFormInstrutor.reset();
    this.registerFormHino.reset();
    this.registerFormOcorrencia.reset();
    var condicaoLogada = Object.values(this.pessoaLogada)[13];
    var encarregadoLocal = Object.values(this.pessoaLogada)[3];
    var encarregadoRegional = Object.values(this.pessoaLogada)[4];
    this.registerFormInstrutor.patchValue({
      encarregadoLocal: condicaoLogada.toLocaleLowerCase() === 'encarregado'
        && encarregadoLocal === '' ? this.pessoaLogada.nome : encarregadoLocal,
      encarregadoRegional: condicaoLogada.toLocaleLowerCase() === 'regional'
        && encarregadoRegional === '' ? this.pessoaLogada.nome : encarregadoRegional,
      condicao: this.condicaoCarousel,
      comum: this.pessoaLogada.comum,
      regiao: this.pessoaLogada.regiao,
      regional: this.pessoaLogada.regional,
    });
    this.modoSalvar = 'post';
    modalDadosPessoais.show();
  }

  //////////////////////////////////Dados Pessoais////////////////////////////////
  //////////////////////////////////Edição////////////////////////////////////////
  editarDadosPessoais(dadosPessoais: Pessoa, modalDadosPessoais: any) {
    this.modoSalvar = 'put';
    modalDadosPessoais.show();
  }


  salvarPessoa(modalDadosPessoais: any, modalAluno: any) {
    var pessoa = Object.assign({}, this.registerFormInstrutor.value);
    if (this.registerFormInstrutor.valid) {
      var condicaoLogada = sessionStorage.getItem('role');
      var instrutorLogado = condicaoLogada !== 'INSTRUTOR' ? '' : sessionStorage.getItem('username')!;
      if (this.modoSalvar == 'put') {
        var pessoaPut = {
          id: this.idPessoa,
          nome: pessoa.nome, encarregadoLocal: pessoa.encarregadoLocal, instrutor: instrutorLogado,
          encarregadoRegional: pessoa.encarregadoRegional, regiao: pessoa.regiao,
          regional: pessoa.regional, celular: pessoa.celular, email: pessoa.email,
          dataNascimento: this.transformDate(pessoa.dataNascimento), dataInicio: this.transformDate(pessoa.dataInicio),
          comum: pessoa.comum, instrumento: pessoa.instrumento, condicao: pessoa.condicao
        };

        this.pessoaService.atualizarPessoa(pessoaPut)
          .subscribe(
            (pessoa: Pessoa) => {
              this.toastr.success('Dados pessoais atualizados com sucesso.');
              this.listarMusicos('INSTRUTOR');
              modalDadosPessoais.hide();
              modalAluno.hide();
            }, error => {
              if (error.status === 400) {
                this.toastr.warning(error.error);
              } else {
                this.toastr.error(error.error);
              }
              console.clear();
            });
      } else if (this.modoSalvar == 'post') {
        var pessoaPost = {
          nome: pessoa.nome, encarregadoLocal: pessoa.encarregadoLocal, instrutor: instrutorLogado,
          encarregadoRegional: pessoa.encarregadoRegional, regiao: pessoa.regiao,
          regional: pessoa.regional, celular: pessoa.celular, email: pessoa.email,
          dataNascimento: pessoa.dataNascimento, dataInicio: pessoa.dataInicio,
          comum: pessoa.comum, instrumento: pessoa.instrumento, condicao: pessoa.condicao
        };
        this.pessoaService.registroPessoa(pessoaPost)
          .subscribe(
            (pessoa: Pessoa) => {
              this.toastr.success('Dados salvos com sucesso.');
              this.listarMusicos('INSTRUTOR');
              modalDadosPessoais.hide();
              modalAluno.hide();
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
  }

  /////////////////////////////////////Dados Pessoais/////////////////////////////
  /////////////////////////////////////Exclusão///////////////////////////////////
  removerPessoa(modalRemoverPessoa: any, pessoa: Pessoa) {
    modalRemoverPessoa.show();
    this.nomePessoa = pessoa.nome;
  }

  confirmarExclusaoPessoa(modalRemoverPessoa: any, modalAluno: any) {
    if (this.idPessoa !== null && this.idPessoa !== undefined && this.idPessoa > 0) {
      var model = { idPessoa: this.idPessoa, apelidoDonoDaFicha: this.apelidoPessoaLogada };
      this.pessoaService.excluirPessoaNaFicha(model)
        .subscribe(
          () => {
            this.toastr.success('Pessoa deletada com sucesso.');
            this.listarMusicos('INSTRUTOR');
            modalRemoverPessoa.hide();
            modalAluno.hide();
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

  abrirModalInstrutor(pessoa: Pessoa, modalAluno: any) {
    this.idPessoa = pessoa.id;
    modalAluno.show();
    this.registerFormInstrutor.patchValue({
      id: pessoa.id,
      nome: pessoa.nome,
      instrutor: pessoa.apelidoInstrutor,
      encarregadoLocal: pessoa.apelidoEncarregado,
      encarregadoRegional: pessoa.apelidoEncRegional,
      regiao: pessoa.regiao,
      regional: pessoa.regional,
      celular: pessoa.celular,
      email: pessoa.email,
      dataNascimento: pessoa.dataNascimento,
      dataInicio: pessoa.dataInicio,
      comum: pessoa.comum,
      instrumento: pessoa.instrumento,
      condicao: pessoa.condicao,
      ocorrencias: pessoa.ocorrencias,
      hinos: pessoa.hinos
    });
  }
}
