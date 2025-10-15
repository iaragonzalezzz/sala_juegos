import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { supabase } from '../../core/supabase.client';

interface Encuesta {
  id: string;
  usuario_id: string;
  nombre_apellido: string;
  edad: number | string;
  telefono: string;
  pregunta1: string;
  pregunta2: string;
  pregunta3: string;
  created_at: string;
}

@Component({
  selector: 'app-resultados-encuesta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultados-encuestas.component.html',
  styleUrls: ['./resultados-encuestas.component.css']
})
export class ResultadosEncuestaComponent implements OnInit {
  resultados: Encuesta[] = [];
  cargando = true;

  async ngOnInit() {
    await this.cargarResultados();
  }

  async cargarResultados() {
    try {
      this.cargando = true;
      const { data, error } = await supabase.from('encuestas').select('*');
      if (error) throw error;
      this.resultados = (data || []).map((r: any) => ({
        id: r.id,
        usuario_id: r.usuario_id,
        nombre_apellido: r.nombre_apellido || '',
        edad: r.edad || '',
        telefono: r.telefono || '',
        pregunta1: r.pregunta1 || '',
        // Si viene como JSON/array lo convertimos a string
        pregunta2: Array.isArray(r.pregunta2)
          ? r.pregunta2.join(', ')
          : typeof r.pregunta2 === 'string'
          ? r.pregunta2.replace(/^\[\"|\"\]$/g, '') // limpia corchetes si viene como string
          : '',
        pregunta3: r.pregunta3 || '',
        created_at: r.created_at || ''
      }));
    } catch (err) {
      console.error('Error cargando encuestas:', err);
      this.resultados = [];
    } finally {
      this.cargando = false;
    }
  }
}
