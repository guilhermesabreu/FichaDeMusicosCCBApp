import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comum } from 'src/app/models/Comum';
import { Regiao } from 'src/app/models/Regiao';
import { Regional } from 'src/app/models/Regional';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocalidadeService {

baseURLHino = environment.BASE_URL+'localidades';

constructor(private http: HttpClient) { }
  buscarRegionais(event: string){
    return this.http.get<string[]>(`${this.baseURLHino}/regionais?Input=${event}`);
  }

  buscarRegioes(event: string){
    return this.http.get<string[]>(`${this.baseURLHino}/regioes?Input=${event}`);
  }

  buscarComuns(event: string){
    return this.http.get<string[]>(`${this.baseURLHino}/comuns?Input=${event}`);
  }
}
