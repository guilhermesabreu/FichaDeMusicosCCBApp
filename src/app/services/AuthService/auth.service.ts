import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Pessoa } from 'src/app/models/Pessoa';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseURLPessoa = 'https://fichademusicosccbapi.herokuapp.com/api/v1/pessoas';
  decodedToken: any;
  constructor(private http: HttpClient) { }

  login(model: any) {
    return this.http
    .post(`${this.baseURLPessoa}/login`, model).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          localStorage.setItem('token', JSON.stringify(user.token));
          sessionStorage.setItem('username', JSON.stringify(user.user));
        }
      })
      );
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
