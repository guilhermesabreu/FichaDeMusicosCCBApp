import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Hino } from 'src/app/models/Hino';

@Injectable({
  providedIn: 'root'
})
export class HinoService {

  baseURLHino = 'https://fichademusicosccbapi.herokuapp.com/api/v1/hinos';
  
  constructor(private http: HttpClient) { }

}
