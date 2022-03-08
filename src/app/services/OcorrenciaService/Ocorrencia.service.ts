import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ocorrencia } from 'src/app/models/Ocorrencia';

@Injectable({
  providedIn: 'root'
})
export class OcorrenciaService {

  baseURLOcorrencia = 'https://fichademusicosccbapi.herokuapp.com/api/v1/ocorrencias';
  
  constructor(private http: HttpClient) { }

  editarOcorrencia(ocorrencia: any){
    return this.http.put<Ocorrencia>(`${this.baseURLOcorrencia}`, ocorrencia);
  }

}
