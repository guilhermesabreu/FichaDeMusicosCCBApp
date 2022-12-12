import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ocorrencia } from 'src/app/models/Ocorrencia';

@Injectable({
  providedIn: 'root'
})
export class OcorrenciaService {

  baseURLOcorrencia = 'https://fichademusicosccbapi.fly.dev/api/v1/ocorrencias';
  
  constructor(private http: HttpClient) { }

  cadastrarOcorrencia(ocorrencia: any){
    return this.http.post<Ocorrencia>(`${this.baseURLOcorrencia}`, ocorrencia);
  }

  editarOcorrencia(ocorrencia: any){
    return this.http.put<Ocorrencia>(`${this.baseURLOcorrencia}`, ocorrencia);
  }

  deletarOcorrencia(idOcorrencia: number){
    return this.http.delete(`${this.baseURLOcorrencia}/${idOcorrencia}`);
  }

}
