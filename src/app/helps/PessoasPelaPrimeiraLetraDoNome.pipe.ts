import { Pipe, PipeTransform } from '@angular/core';
import { Pessoa } from '../models/Pessoa';

@Pipe({
  name: 'PessoasPelaPrimeiraLetraDoNome'
})
export class PessoasPelaPrimeiraLetraDoNomePipe implements PipeTransform {

  transform(pessoas: Pessoa[], primeiraLetra: string): Pessoa[] {
    var pes = pessoas.map(item => item)
    .filter((item) => item.nome.substring(0,1) === primeiraLetra);
    var a = pessoas.map(item => item)
           .filter((value, index, self) => self.indexOf(value) === index);
    return pessoas.map(item => item)
           .filter((value, index, self) => self.indexOf(value) === index);
  }
}
