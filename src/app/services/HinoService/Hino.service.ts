import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Hino } from 'src/app/models/Hino';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HinoService {

  baseURLHino = environment.BASE_URL+'hinos';

  constructor(private http: HttpClient) { }

  salvarHino(hino: any){
    return this.http.post<Hino>(`${this.baseURLHino}`, hino);
  }

  deletarHino(idHino: number) {
    return this.http.delete(`${this.baseURLHino}/${idHino}`);
  }
}
