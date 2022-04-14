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

  buscarAluno(text: string) {
    return this.http.get<string[]>(`${this.baseURLPessoa}/nome-aluno?text=${text}`);
  }

  buscarInstrutor(text: string) {
    return this.http.get<string[]>(`${this.baseURLPessoa}/nome-instrutor?text=${text}`);
  }

  buscarEncarregadoLocal(text: string) {
    return this.http.get<string[]>(`${this.baseURLPessoa}/nome-encarregado-local?text=${text}`);
  }

  buscarEncarregadoRegional(text: string) {
    return this.http.get<string[]>(`${this.baseURLPessoa}/nome-encarregado-regional?text=${text}`);
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
