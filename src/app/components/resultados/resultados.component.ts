import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../core/supabase.service';

interface Resultado {
  usuario: string;
  puntaje: number;
  total?: number; // solo para Preguntados
  fecha: string;
}

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css']
})
export class ResultadosComponent implements OnInit {
  ahorcado: Resultado[] = [];
  mayorMenor: Resultado[] = [];
  preguntados: Resultado[] = [];
  adivinaNumero: Resultado[] = [];

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    this.ahorcado = await this.obtenerResultados('resultados_ahorcado');
    this.mayorMenor = await this.obtenerResultados('resultados_mayor_menor');
    this.preguntados = await this.obtenerResultados('resultados_preguntados');
    this.adivinaNumero = await this.obtenerResultados('resultados_propio');
  }

  private async obtenerResultados(tabla: string): Promise<Resultado[]> {
    try {
      const data = await this.supabase.obtener(tabla);
      console.log("Datos de", tabla, data); // 👀 Para debug

      return data.map((r: any) => ({
        usuario: r.usuario,
        puntaje: r.puntaje,
        total: r.total ?? null,
        fecha: new Date(r.fecha).toLocaleString()
      })) as Resultado[];

    } catch (error) {
      console.error(`Error al obtener resultados de ${tabla}`, error);
      return [];
    }
  }
}
