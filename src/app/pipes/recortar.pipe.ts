import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'recortar',
  standalone: true
})
export class RecortarPipe implements PipeTransform {
  transform(valor: string, limite: number = 60): string {
    if (!valor) return '';
    return valor.length > limite ? valor.slice(0, limite) + '…' : valor;
  }
}
