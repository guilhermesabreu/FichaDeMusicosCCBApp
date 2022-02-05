import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pessoa } from 'src/app/models/Pessoa';

@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  baseURLPessoa = 'https://fichademusicosccbapi.herokuapp.com/api/v1/pessoas';
  constructor(private http: HttpClient) { }

  buscarEncarregadoLocal(text: string) {
    var a = this.http.get<string[]>(`${this.baseURLPessoa}/buscar-encarregado-local?text=${text}`);
    console.log(a);
    return a;
  }

  buscarEncarregadoRegional(text: string) {
    return this.http.get<string[]>(`${this.baseURLPessoa}/buscar-encarregado-regional?text=${text}`);
  }

  registroPessoa(model: Pessoa) {
    return this.http.post(`${this.baseURLPessoa}`, model);
  }

  atualizarPessoa(model: Pessoa){
    return this.http.put(`${this.baseURLPessoa}`, model);
  }

  deletarPessoa(userName: string) {
    return this.http.delete(`${this.baseURLPessoa}/${userName}`);
  }
}