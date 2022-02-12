import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  dataAtual: any;
  constructor(public datepipe: DatePipe) { }

  ngOnInit() {
    this.dataAtual = new Date;
    this.dataAtual = this.datepipe.transform(this.dataAtual, 'yyyy');
  }

}