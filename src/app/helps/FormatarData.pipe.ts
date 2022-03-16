import { DatePipe } from '@angular/common';
import { invalid } from '@angular/compiler/src/render3/view/util';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'FormatarData'
})
export class FormatarDataPipe extends DatePipe implements PipeTransform {

  override transform(data: any, args?: any): any {
    var dataConvertida = new Date(data);
    if(dataConvertida.toString() == 'Invalid Date')
      return data;

    return super.transform(data, 'dd/MM/yyyy');
  }

}
