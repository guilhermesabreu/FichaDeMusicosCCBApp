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

  registroPessoa(model: Pessoa) {
    return this.http.post(`${this.baseURLPessoa}`, model);
  }

  atualizarPessoa(model: any){
    return this.http.put<Pessoa>(`${this.baseURLPessoa}`, model);
  }

  deletarPessoa(userName: string) {
    return this.http.delete(`${this.baseURLPessoa}/${userName}`);
  }
}
