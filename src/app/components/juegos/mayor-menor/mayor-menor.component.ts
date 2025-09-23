import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartaSvgComponent } from './carta-svg.component';

interface Carta {
  valor: number;
  palo: string;
}

@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [CommonModule, CartaSvgComponent],
  templateUrl: './mayor-menor.component.html',
  styleUrls: ['./mayor-menor.component.css']
})
export class MayorMenorComponent {
  cartas: Carta[] = [];
  actual!: Carta;
  ultima!: Carta;
  puntaje: number = 0;
  vidas: number = 3;
  mostrarGameOver: boolean = false; 

  palos = ['♥', '♦', '♣', '♠'];

  constructor(private router: Router) {
    this.generarCartas();
    this.iniciarJuego();
  }

  generarCartas() {
    this.cartas = [];
    for (let valor = 1; valor <= 13; valor++) {
      for (let palo of this.palos) {
        this.cartas.push({ valor, palo });
      }
    }
  }

  iniciarJuego() {
    this.puntaje = 0;
    this.vidas = 3;
    this.mostrarGameOver = false;
    this.ultima = this.cartas[Math.floor(Math.random() * this.cartas.length)];
    this.sacarCarta();
  }

  sacarCarta() {
    let nueva: Carta;
    do {
      nueva = this.cartas[Math.floor(Math.random() * this.cartas.length)];
    } while (this.ultima && nueva.valor === this.ultima.valor && nueva.palo === this.ultima.palo);

    this.actual = nueva;
  }

  elegir(opcion: 'mayor' | 'menor') {
    if (!this.actual || !this.ultima) return;

    const esMayor = this.actual.valor > this.ultima.valor;
    const esMenor = this.actual.valor < this.ultima.valor;

    if ((opcion === 'mayor' && esMayor) || (opcion === 'menor' && esMenor)) {
      this.puntaje++;
    } else {
      this.vidas--;
      if (this.vidas === 0) {
        this.mostrarGameOver = true;
        return;
      }
    }

    this.ultima = this.actual;
    this.sacarCarta();
  }

  volver() {
    this.router.navigate(['/juegos']);
  }
}

