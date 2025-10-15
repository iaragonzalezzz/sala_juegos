import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { supabase } from '../../core/supabase.client';
import { ResaltarTopDirective } from '../../directives/resaltar-top.directive';
import { FiltroJuegoPipe } from '../../pipes/filtro-juego.pipe';

interface Resultado {
  usuario: string;
  puntaje: number;
  juego: string;
  fecha?: string;
}

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule, FormsModule, ResaltarTopDirective],
  providers: [FiltroJuegoPipe],
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css']
})
export class ResultadosComponent implements OnInit {
  resultados: Resultado[] = [];
  cargando = true;

  juegos = ['Ahorcado', 'Mayor o Menor', 'Preguntados', 'Propio'];
  juegoSeleccionado = 'Todos';

  constructor(private filtroJuegoPipe: FiltroJuegoPipe) {}

  async ngOnInit() {
    await this.cargarResultados();
  }

  async cargarResultados() {
    try {
      this.cargando = true;

      const ahorcado = await this.obtenerResultadosDe('resultados_ahorcado', 'Ahorcado');
      const mayorMenor = await this.obtenerResultadosDe('resultados_mayor_menor', 'Mayor o Menor');
      const preguntados = await this.obtenerResultadosDe('resultados_preguntados', 'Preguntados');
      const propio = await this.obtenerResultadosDe('resultados_propio', 'Propio');

      this.resultados = [...ahorcado, ...mayorMenor, ...preguntados, ...propio];
    } catch (error) {
      console.error('Error cargando resultados:', error);
    } finally {
      this.cargando = false;
    }
  }

  private async obtenerResultadosDe(tabla: string, juego: string): Promise<Resultado[]> {
    try {
      const { data, error } = await supabase.from(tabla).select('*');
      if (error) throw error;

      return (data || []).map((r: any) => ({
        usuario: r.usuario,
        puntaje: r.puntaje,
        juego,
        fecha: r.fecha
          ? new Date(r.fecha).toLocaleString('es-AR', {
              dateStyle: 'short',
              timeStyle: 'short'
            })
          : ''
      }));
    } catch (error) {
      console.error(`Error al obtener resultados de ${tabla}:`, error);
      return [];
    }
  }

  filtrarJuego() {
    console.log('Mostrando:', this.juegoSeleccionado);
  }

  // 🔹 Método que usa la pipe
  resultadosPorJuego(juego: string): Resultado[] {
    return this.filtroJuegoPipe.transform(this.resultados, juego);
  }
}
