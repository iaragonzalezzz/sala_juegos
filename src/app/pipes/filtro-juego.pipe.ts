import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroJuego',
  standalone: true
})
export class FiltroJuegoPipe implements PipeTransform {
  transform(resultados: any[], juego: string): any[] {
    if (!resultados || !juego) return [];

    return resultados
      .filter(r => r.juego === juego)
      .sort((a, b) => b.puntaje - a.puntaje);
  }
}