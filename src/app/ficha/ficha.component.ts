import { Component, Injectable, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EventEmitterService } from '../event-emmiter/event-emitter.service';
import { Pessoa } from '../models/Pessoa';
import { PessoaService } from '../services/PessoaService/pessoa.service';

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

  constructor(
    private eventEmitterService: EventEmitterService,
    public pessoaService: PessoaService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
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



  listarMusicos(opcaoRole: string) {
    var condicao = sessionStorage.getItem('role');
    var apelido = sessionStorage.getItem('username');
    var lParametros = "";
    lParametros += condicao === 'ENCARREGADO' ? 'ApelidoEncarregado= ' + apelido
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
}
