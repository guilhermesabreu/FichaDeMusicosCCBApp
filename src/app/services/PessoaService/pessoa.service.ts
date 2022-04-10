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
    return this.http.get<Pessoa>(`${this.baseURLPessoa}/buscar-pessoa-logada?apelido=${lParametro}`);
  }

  listaDeMusicos(lParametros: string) {
    return this.http.get<Pessoa[]>(`${this.baseURLPessoa}/por-condicao?${lParametros}`);
  }

  buscarInstrutor(text: string) {
    return this.http.get<string[]>(`${this.baseURLPessoa}/buscar-instrutor?text=${text}`);
  }

  buscarEncarregadoLocal(text: string) {
    return this.http.get<string[]>(`${this.baseURLPessoa}/buscar-encarregado-local?text=${text}`);
  }

  buscarEncarregadoRegional(text: string) {
    return this.http.get<string[]>(`${this.baseURLPessoa}/buscar-encarregado-regional?text=${text}`);
  }

  registroPessoa(model: any) {
    return this.http.post<Pessoa>(`${this.baseURLPessoa}`, model);
  }

  atualizarPessoa(model: any){
    return this.http.put<Pessoa>(`${this.baseURLPessoa}`, model);
  }

  deletarPessoa(idPessoa: number) {
    return this.http.delete(`${this.baseURLPessoa}/${idPessoa}`);
  }
}
