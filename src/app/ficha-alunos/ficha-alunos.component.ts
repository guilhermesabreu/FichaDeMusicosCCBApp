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
  templateUrl: './ficha-alunos.component.html',
  styleUrls: ['./ficha-alunos.component.css'],
})

@Injectable()
export class FichaAlunosComponent implements OnInit {

  nomePessoa!: string;
  condicaoTitulo!: string;
  pessoaLogada!: Pessoa;
  pessoa!: Pessoa;
  pessoas!: Pessoa[];
  hino!: Hino;
  ocorrencia!: Ocorrencia;
  ocorrencias!: Ocorrencia[];
  alfabetoPessoas!: string[];
  registerFormAluno!: FormGroup;
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
    this.condicaoCarousel = 'ALUNO';
    this.condicaoTitulo = 'Alunos';
    this.listarMusicos('');
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
    this.registerFormAluno = this.fb.group({
      id: [''],
      nome: ['', [Validators.required, Validators.minLength(10)]],
      alunoPesquisado: [''],
      instrutor: [''],
      encarregadoLocal: [''],
      encarregadoRegional: [''],
      regiao: [''],
      regional: [''],
      celular: [''],
      email: [''],
      dataNascimento: [''],
      dataInicio: [''],
      comum: [''],
      instrumento: ['', Validators.required],
      condicao: [''],
      ocorrencias: [''],
      hinos: ['']
    });

    this.registerFormOcorrencia = this.fb.group({
      idOcorrencia: [''],
      dataOcorrencia: ['', Validators.required],
      nomeMetodo: ['', Validators.required],
      observacaoInstrutor: ['', Validators.required]
    });

    this.registerFormHino = this.fb.group({
      numeroHino: ['', Validators.required],
      vozHino: ['', Validators.required],
      dataHino: ['', Validators.required],
    });
  }


  /////////////////////////////////////INTEGRAÇÕES////////////////////////////////////////
  solicitar(aluno: any, ocorrencia: Ocorrencia) {
    var msg = `*Olá aluno ${aluno.nome} !!! Segue a ocorrência do dia: ${ocorrencia.dataOcorrencia}* \r\n 
    Método: ${ocorrencia.nomeMetodo} \r\n 
    Observação: ${ocorrencia.observacaoInstrutor}`;
    this.envioWhatsApp(msg, aluno.celular);
  }

  envioWhatsApp(msg: string, number: number){
    let target = `https://api.whatsapp.com/send?phone=${encodeURIComponent(number)}&text=${encodeURIComponent(msg)}`;
        
    window.open(target,"_blank");
  }

  ////////////////////////////////////Listas///////////////////////////////////////
  instrumentos = ['baritono', 'clarinete', 'eufonio', 'clarinete alto', 'clarinete baixo', 'corne ingês', 'fagote', 'flauta',
  'flugelhorn', 'oboé', 'oboe d` amore', 'saxofone alto', 'saxofone baixo', 'saxofone barítono', 'saxofone tenor',
  'trombone', 'trompa', 'trompete', 'tuba', 'violino', 'viola', 'violoncelo'];

  autoCompleteAluno(event: any) {
    this.pessoaService.buscarAluno(event.query, this.apelidoPessoaLogada)
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

  autoCompleteInstrutor(event: any) {
    this.pessoaService.buscarInstrutor(event.query, this.apelidoPessoaLogada)
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

  autoCompleteEncarregadoRegional(event: any) {
    this.pessoaService.buscarEncarregadoRegional(event.query, this.apelidoPessoaLogada)
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

  transformDateObject(date: any) {
    if (typeof date === 'object') {
      const dat = new Date(date).toLocaleDateString('pt-BR');
      return dat;
    } else {
      var dateParts = date.split("/");
      var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
      const dat = new Date(dateObject).toLocaleDateString('pt-BR');
      return dat;
    }
  }

  separateDatafromTime(date: any) {
    var dateParts = date.split(" ");
    return dateParts[0];
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
  inserirPessoaNaFicha(modalDadosPessoais: any) {
    var alunoPesquisado = this.registerFormAluno.value.alunoPesquisado;
    this.apelidoPessoaLogada = sessionStorage.getItem('username')!;
    var model = { apelidoDonoDaFicha: this.apelidoPessoaLogada, nomeAluno: alunoPesquisado };

    if (alunoPesquisado !== null && alunoPesquisado !== undefined && alunoPesquisado !== '') {
      this.pessoaService.incluirAlunoNaFicha(model)
        .subscribe(
          (res: Pessoa) => {
            this.toastr.success('Aluno inserido na sua ficha com sucesso.');
            this.listarMusicos('ALUNO');
            modalDadosPessoais.hide();
          }, error => {
            if (error.status === 400) {
              this.toastr.warning(error.error);
            } else {
              this.toastr.error(error.error);
            }
            console.clear();
          });
    } else {
      this.toastr.warning('Encontre um aluno já cadastrado');
    }
  }


  cadastrarPessoa(modalDadosPessoais: any) {
    this.registerFormAluno.reset();
    this.registerFormHino.reset();
    this.registerFormOcorrencia.reset();
    var condicaoLogada = Object.values(this.pessoaLogada)[13];
    var encarregadoLocal = Object.values(this.pessoaLogada)[3];
    var encarregadoRegional = Object.values(this.pessoaLogada)[4];
    this.registerFormAluno.patchValue({
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
    var pessoa = Object.assign({}, this.registerFormAluno.value);
    if (this.registerFormAluno.valid) {
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
              this.listarMusicos('ALUNO');
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
              this.listarMusicos('ALUNO');
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
            this.listarMusicos('ALUNO');
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

  ////////////////////////////////////Ocorrências/////////////////////////////////
  ////////////////////////////////////Edição//////////////////////////////////////
  editarOcorrenciaNaLista(ocorrencia: Ocorrencia) {
    ocorrencia.dataOcorrencia = this.toISOFormatDataHora(ocorrencia.dataOcorrencia);
    var indice = this.ocorrencias.findIndex((obj => obj.idOcorrencia == ocorrencia.idOcorrencia));
    this.pessoa.ocorrencias[indice] = ocorrencia;
  }

  preencherModalEdicaoOcorrencia(ocorrencia: Ocorrencia, modalOcorrencia: any) {
    modalOcorrencia.show();
    this.opcaoMudancaOcorrencia = 'PUT';
    this.registerFormOcorrencia.patchValue({
      idOcorrencia: ocorrencia.idOcorrencia,
      nomeMetodo: ocorrencia.nomeMetodo,
      observacaoInstrutor: ocorrencia.observacaoInstrutor,
      dataOcorrencia: ocorrencia.dataOcorrencia
    });
  }

  salvarOcorrencia(modalOcorrencia: any) {
    if (this.idPessoa !== null && this.idPessoa !== undefined && this.idPessoa > 0) {
      if (this.registerFormOcorrencia.valid) {
        this.ocorrencia = Object.assign({}, this.registerFormOcorrencia.value);
        if (this.opcaoMudancaOcorrencia === 'PUT') {
          var ocorrenciaPut = {
            idOcorrencia: this.ocorrencia.idOcorrencia,
            nomeMetodo: this.ocorrencia.nomeMetodo,
            observacaoInstrutor: this.ocorrencia.observacaoInstrutor,
            dataOcorrencia: this.transformDateObject(this.ocorrencia.dataOcorrencia),
            idPessoa: this.idPessoa
          };
          this.ocorrenciaService.editarOcorrencia(ocorrenciaPut)
            .subscribe(
              (oco: Ocorrencia) => {
                this.toastr.success('Ocorrência editada com sucesso.');
                this.listarMusicos('ALUNO');
                this.editarOcorrenciaNaLista(oco);
                modalOcorrencia.hide();
              }, error => {
                if (error.status === 400) {
                  this.toastr.warning(error.error);
                } else {
                  this.toastr.error(error.error);
                }
                console.clear();
              });

        } else {
          var ocorrenciaPost = {
            nomeMetodo: this.ocorrencia.nomeMetodo,
            observacaoInstrutor: this.ocorrencia.observacaoInstrutor,
            dataOcorrencia: this.transformDate(new Date(this.ocorrencia.dataOcorrencia)),
            idPessoa: this.idPessoa
          };
          this.ocorrenciaService.cadastrarOcorrencia(ocorrenciaPost)
            .subscribe(
              (oco: Ocorrencia) => {
                this.toastr.success('Ocorrência salva com sucesso.');
                this.listarMusicos('ALUNO');
                this.incluirOcorrenciasNaLista(oco);
                modalOcorrencia.hide();
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
    else {
      this.toastr.error('Ocorrência não localizada na base de dados.')
    }
  }

  //////////////////////////////////Ocorrências///////////////////////////////////
  //////////////////////////////////Inclusão//////////////////////////////////////
  registrarOcorrencia(modalOcorrencia: any) {
    this.registerFormOcorrencia.reset();
    this.opcaoMudancaOcorrencia = 'POST';
    modalOcorrencia.show();
  }

  incluirOcorrenciasNaLista(ocorrencia: Ocorrencia) {
    ocorrencia.dataOcorrencia = this.toISOFormatDataHora(ocorrencia.dataOcorrencia);
    this.pessoa.ocorrencias.push(ocorrencia);
  }

  ///////////////////////////////////Ocorrências//////////////////////////////////
  //////////////////////////////////Exclusão//////////////////////////////////////
  retirarOcorrenciaDaTabela() {
    var indice = this.ocorrencias.findIndex((obj => obj.idOcorrencia == this.idOcorrencia));
    this.pessoa.ocorrencias.splice(indice, 1);
  }

  excluirOcorrencia(ocorrencia: Ocorrencia, modalRemoverOcorrencia: any) {
    modalRemoverOcorrencia.show();
    this.ocorrenciaParaExcluir = ocorrencia.dataOcorrencia;
    this.idOcorrencia = ocorrencia.idOcorrencia;
  }

  confirmarExclusaoOcorrencia(modalRemoverOcorrencia: any) {
    if (this.idOcorrencia !== null && this.idOcorrencia !== undefined && this.idOcorrencia > 0) {
      this.ocorrenciaService.deletarOcorrencia(this.idOcorrencia)
        .subscribe(
          () => {
            this.toastr.success('Ocorrência deletada com sucesso.');
            this.listarMusicos('ALUNO');
            this.retirarOcorrenciaDaTabela();
            modalRemoverOcorrencia.hide();
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
      this.toastr.error('Hino não localizado na base de dados.')
    }
  }

  ////////////////////////////////////Hinos///////////////////////////////////////
  ////////////////////////////////////Remoção/////////////////////////////////////
  retirarHinoDoCombo() {
    var x = (document.getElementById("hinoSelecionado")) as HTMLSelectElement;
    x!.remove(x.selectedIndex);
  }

  removerHino(modalRemoverHino: any) {
    modalRemoverHino.show();
    var h = (document.getElementById("hinoSelecionado")) as HTMLSelectElement;
    var sel = h.selectedIndex;
    var opt = h.options[sel]
    this.hinoParaExcluir = opt.text;
    this.idHino = parseInt(opt.value);
  }

  confirmarExclusaoHino(modalRemoverHino: any) {
    if (this.idHino !== null && this.idHino !== undefined && this.idHino > 0) {
      this.hinoService.deletarHino(this.idHino)
        .subscribe(
          () => {
            this.toastr.success('Hino deletado com sucesso.');
            this.listarMusicos('ALUNO');
            this.retirarHinoDoCombo();
            modalRemoverHino.hide();
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
      this.toastr.error('Hino não localizado na base de dados.')
    }
  }

  ////////////////////////////////////Hinos///////////////////////////////////////
  ////////////////////////////////////Inclusão////////////////////////////////////
  registrarHino(modalNovoHino: any) {
    modalNovoHino.show();
  }

  salvarHino(modalNovoHino: any) {
    if (this.idPessoa !== null && this.idPessoa !== undefined && this.idPessoa > 0) {
      if (this.registerFormHino.valid) {
        this.hino = Object.assign({}, this.registerFormHino.value);
        var hinoPost = { numero: this.hino.numeroHino, voz: this.hino.vozHino, idPessoa: this.idPessoa, data: this.hino.dataHino };
        this.hinoService.salvarHino(hinoPost)
          .subscribe(
            (hino: Hino) => {
              var hinoResponse = { numeroHino: hino.numeroHino, vozHino: hino.vozHino, idHino: hino.idHino, dataHino: hino.dataHino };
              this.toastr.success('Hino cadastrado com sucesso.');
              this.listarMusicos('ALUNO');
              this.adicionarHinoAoCombo(hinoResponse);
              modalNovoHino.hide();
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
    else {
      this.toastr.error('Hino não localizado na base de dados.')
    }
  }

  adicionarHinoAoCombo(hinoCriado: Hino) {
    if (this.registerFormHino.valid) {
      this.pessoa.hinos.push(hinoCriado);
    }
  }

  abrirModalAluno(pessoa: Pessoa, modalAluno: any) {
    //this.listarMusicos('ALUNO');
    this.idPessoa = pessoa.id;
    modalAluno.show();
    this.registerFormAluno.patchValue({
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

