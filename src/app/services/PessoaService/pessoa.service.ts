import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Pessoa } from 'src/app/models/Pessoa';

@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  baseURLPessoa = 'https://fichademusicosccbapi.herokuapp.com/api/v1/pessoas';
  

  constructor(private http: HttpClient) { }

  buscarPessoaLogada(lParametro: string) {
    return this.http.get<Pessoa>(`${this.baseURLPessoa}/logada?apelido=${lParametro}`);
  }

  listaDeMusicos(lParametros: string) {
    return this.http.get<Pessoa[]>(`${this.baseURLPessoa}/por-condicao?${lParametros}`);
  }

  buscarAluno(input?: string, pessoaLogada?: string) {
    return this.http.get<string[]>(`${this.baseURLPessoa}/nome-aluno?Input=${input}&ApelidoPessoaLogada=${pessoaLogada}`);
  }

  buscarInstrutor(input?: string, pessoaLogada?: string) {
    return this.http.get<Pessoa[]>(`${this.baseURLPessoa}/instrutor-por-nome?Input=${input}&ApelidoPessoaLogada=${pessoaLogada}`);
  }

  buscarEncarregadoLocal(input?: string, pessoaLogada?: string) {
    return this.http.get<Pessoa[]>(`${this.baseURLPessoa}/encarregado-local-por-nome?Input=${input}&ApelidoPessoaLogada=${pessoaLogada}`);
  }

  buscarEncarregadoRegional(input?: string, pessoaLogada?: string) {
    return this.http.get<Pessoa[]>(`${this.baseURLPessoa}/encarregado-regional-por-nome?Input=${input}&ApelidoPessoaLogada=${pessoaLogada}`);
  }

  recuperarSenha(model: any) {
    return this.http.post<Pessoa>(`${this.baseURLPessoa}/recuperar-senha`, model);
  }

  registroPessoa(model: any) {
    return this.http.post<Pessoa>(`${this.baseURLPessoa}`, model);
  }

  incluirAlunoNaFicha(model: any){
    return this.http.put<Pessoa>(`${this.baseURLPessoa}/incluir-aluno-na-ficha`, model);
  }

  atualizarPessoa(model: any){
    return this.http.put<Pessoa>(`${this.baseURLPessoa}`, model);
  }

  excluirPessoa(idPessoa: number) {
    return this.http.delete(`${this.baseURLPessoa}/${idPessoa}`);
  }

  excluirPessoaNaFicha(model: any) {
    return this.http.put(`${this.baseURLPessoa}/excluir-pessoa-na-ficha`, model);
  }
}
