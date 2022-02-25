import { Component, Injectable, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EventEmitterService } from '../event-emmiter/event-emitter.service';
import { Pessoa } from '../models/Pessoa';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PessoaService } from '../services/PessoaService/pessoa.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Ocorrencia } from '../models/Ocorrencia';
import { Hino } from '../models/Hino';

@Component({
  selector: 'app-ficha',
  templateUrl: './ficha.component.html',
  styleUrls: ['./ficha.component.css']
})

@Injectable()
export class FichaComponent implements OnInit {

  condicaoTitulo!: string;
  pessoas!: Pessoa[];
  alfabetoPessoas!: string[];
  registerFormAluno!: FormGroup;
  registerFormOcorrencia!: FormGroup;
  registerFormHino!: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private eventEmitterService: EventEmitterService,
    public pessoaService: PessoaService,
    private modalService: BsModalService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.validation();
    if (this.eventEmitterService.subsVar == undefined) {
      this.eventEmitterService.subsVar = this.eventEmitterService.
        invokeFirstComponentFunction.subscribe((opcaoRole: string) => {
          if (opcaoRole !== undefined && opcaoRole !== null && opcaoRole !== '') {
            this.listarMusicos(opcaoRole);
            switch (opcaoRole) {
              case 'ALUNO': this.condicaoTitulo = 'Alunos'; break;
              case 'INSTRUTOR': this.condicaoTitulo = 'Instrutores'; break;
              case 'ENCARREGADO': this.condicaoTitulo = 'Encarregados Locais'; break;
            }
          }
        });
    }
    this.condicaoTitulo = 'Alunos';
    this.listarMusicos('');
  }

  validation() {
    this.registerFormAluno = this.fb.group({
      id: [''],
      nome: [''],
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
      instrumento: [''],
      condicao: [''],
      ocorrencias: [''],
      hinos: ['']
    });

    this.registerFormOcorrencia = this.fb.group({
      dataOcorrencia: [''],
      numeroLicao: [''],
      nomeMetodo: [''],
      observacaoInstrutor: ['']
    });

    this.registerFormHino = this.fb.group({
      numeroHino: [''],
      vozHino: ['']
    });
  }

  listarOcorrenciasPorAluno(pessoa: Pessoa) : Ocorrencia[]{
    return pessoa.ocorrencias;
  }

  listarHinosPorAluno(pessoa: Pessoa) : Hino[]{
    return pessoa.hinos;
  }

  listarMusicos(opcaoRole: string) {
    var condicao = sessionStorage.getItem('role');
    var apelido = sessionStorage.getItem('username');
    var lParametros = "";
    lParametros += condicao === 'ENCARREGADO' ? 'ApelidoEncarregado=' + apelido
      : condicao === 'REGIONAL' ? 'ApelidoEncarregadoRegional=' + apelido
        : condicao === 'INSTRUTOR' ? 'ApelidoInstrutor=' + apelido : '';
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

  abrirModalAluno(pessoa: Pessoa, modalAluno: any) {
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
