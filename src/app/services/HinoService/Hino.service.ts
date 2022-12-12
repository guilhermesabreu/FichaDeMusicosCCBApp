import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Hino } from 'src/app/models/Hino';

@Injectable({
  providedIn: 'root'
})
export class HinoService {

  baseURLHino = 'https://fichademusicosccbapi.fly.dev/api/v1/hinos';
  
  constructor(private http: HttpClient) { }

  salvarHino(hino: any){
    return this.http.post<Hino>(`${this.baseURLHino}`, hino);
  }

  deletarHino(idHino: number) {
    return this.http.delete(`${this.baseURLHino}/${idHino}`);
  }
}
