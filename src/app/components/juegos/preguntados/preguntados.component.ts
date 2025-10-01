import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Q {
  categoria: string;
  pregunta: string;
  opciones: string[];
  respuesta: string;
}

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
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

  // Timer
  tiempoRestante: number = 15;
  intervalo: any;

  categoriasColores: { [key: string]: string } = {
    'Geografía': '#34ace0',
    'Historia': '#cc8e35',
    'Ciencia': '#33d9b2',
    'Deportes': '#218c74',
    'Arte': '#706fd3',
    'Entretenimiento': '#ff5252'
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Q[]>('assets/preguntas.json').subscribe((arr) => {
      this.preguntas = arr
        .map((p) => ({
          ...p,
          opciones: [...p.opciones].sort(() => Math.random() - 0.5)
        }))
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

    if (op === this.correcta) {
      this.puntaje++;
    }

    this.finalizado = true;
    clearInterval(this.intervalo);

    setTimeout(() => this.siguiente(), 1500);
  }

  siguiente() {
    this.i++;
    if (this.i >= this.total) {
      this.mostrarGameOver = true;
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

}

