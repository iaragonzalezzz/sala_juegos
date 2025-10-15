import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { supabase } from '../../../core/supabase.client';
import { AuthService } from '../../../core/auth.service';
import { SalaChat } from '../chat/sala-chat';

interface Q {
  categoria: string;
  pregunta: string;
  opciones: string[];
  respuesta: string;
}

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [CommonModule, HttpClientModule, SalaChat],
  templateUrl: './preguntados.component.html',
  styleUrls: ['./preguntados.component.css']
})
export class PreguntadosComponent implements OnInit {
  preguntas: Q[] = [];
  i = 0;
  puntaje = 0;
  total = 0;
  elegida = '';
  correcta = '';
  finalizado = false;
  mostrarGameOver = false;
  tiempoRestante = 15;
  intervalo: any;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.http.get<Q[]>('assets/preguntas.json').subscribe((arr) => {
      this.preguntas = arr
        .map(p => ({ ...p, opciones: [...p.opciones].sort(() => Math.random() - 0.5) }))
        .sort(() => Math.random() - 0.5);
      this.total = this.preguntas.length;
      this.iniciarTimer();
    });
  }

  iniciarTimer() {
    this.tiempoRestante = 15;
    if (this.intervalo) clearInterval(this.intervalo);
    this.intervalo = setInterval(() => {
      this.tiempoRestante--;
      if (this.tiempoRestante === 0) {
        clearInterval(this.intervalo);
        this.elegir('');
      }
    }, 1000);
  }

  elegir(op: string) {
    if (this.finalizado) return;

    this.elegida = op;
    this.correcta = this.preguntas[this.i].respuesta;
    if (op === this.correcta) this.puntaje++;

    this.finalizado = true;
    clearInterval(this.intervalo);
    setTimeout(() => this.siguiente(), 1500);
  }

  siguiente() {
    this.i++;
    if (this.i >= this.total) {
      this.mostrarGameOver = true;
      this.guardarResultado();
      return;
    }
    this.finalizado = false;
    this.elegida = '';
    this.correcta = '';
    this.iniciarTimer();
  }

  reiniciar() {
    this.i = 0;
    this.puntaje = 0;
    this.mostrarGameOver = false;
    this.finalizado = false;
    this.iniciarTimer();
  }

  getColorCategoria(categoria: string): string {
    if (!categoria) return '#9e9e9e';
    switch (categoria.toLowerCase()) {
      case 'geografía': return '#2196f3';
      case 'ciencia': return '#4caf50';
      case 'historia': return '#ff9800';
      case 'deportes': return '#f44336';
      case 'entretenimiento': return '#9c27b0';
      default: return '#9e9e9e';
    }
  }

  async guardarResultado() {
    const usuario = this.auth.user$.value?.email || 'Anónimo';
    const fecha = new Date().toISOString();

    const { error } = await supabase.from('resultados_preguntados').insert([
      { usuario, puntaje: this.puntaje, fecha }
    ]);
    if (error) console.error('Error al guardar resultado:', error.message);
  }
  volver() {
    this.router.navigate(['/juegos']);
  }
}
