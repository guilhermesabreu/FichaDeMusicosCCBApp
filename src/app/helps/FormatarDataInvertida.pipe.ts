import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'FormatarDataInvertida'
})
export class FormatarDataInvertidaPipe extends DatePipe implements PipeTransform {

  override transform(data: any, args?: any): any {
    var tipo = typeof data;
    if (tipo === "object") {
      return this.dataFormatada(data);
    }
    else {
      var parts = data.split('/');
      var mydate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      var dataConvertida = new Date(mydate.toDateString());

      if (dataConvertida.toString() == 'Invalid Date') {
        return data;
      }
      return super.transform(dataConvertida, 'dd/MM/yyyy');
    }
  }

  dataFormatada(dataParam: any) {
    var data = new Date(dataParam),
      dia = data.getDate().toString().padStart(2, '0'),
      mes = (data.getMonth() + 1).toString().padStart(2, '0'), //+1 pois no getMonth Janeiro começa com zero.
      ano = data.getFullYear();
    return dia + "/" + mes + "/" + ano;
  }

}
