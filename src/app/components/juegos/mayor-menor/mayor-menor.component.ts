import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { supabase } from '../../../core/supabase.client';
import { AuthService } from '../../../core/auth.service';
import { CartaSvgComponent } from './carta-svg.component';
import { SalaChat } from '../chat/sala-chat';

interface Carta {
  valor: number;
  palo: string;
}

@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [CommonModule, CartaSvgComponent, SalaChat],
  templateUrl: './mayor-menor.component.html',
  styleUrls: ['./mayor-menor.component.css']
})
export class MayorMenorComponent {
  cartas: Carta[] = [];
  actual!: Carta;
  ultima!: Carta;
  puntaje = 0;
  vidas = 3;
  mostrarGameOver = false;
  palos = ['♥', '♦', '♣', '♠'];

  constructor(
    private router: Router,
    private auth: AuthService
  ) {
    this.generarCartas();
    this.iniciarJuego();
  }

  generarCartas() {
    this.cartas = [];
    for (let valor = 1; valor <= 13; valor++) {
      for (let palo of this.palos) this.cartas.push({ valor, palo });
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

    if ((opcion === 'mayor' && esMayor) || (opcion === 'menor' && esMenor)) this.puntaje++;
    else {
      this.vidas--;
      if (this.vidas === 0) {
        this.mostrarGameOver = true;
        this.guardarResultado();
        return;
      }
    }

    this.ultima = this.actual;
    this.sacarCarta();
  }

  async guardarResultado() {
    const usuario = this.auth.user$.value?.email || 'Anónimo';
    const fecha = new Date().toISOString();

    const { error } = await supabase.from('resultados_mayor_menor').insert([{ usuario, puntaje: this.puntaje, fecha }]);
    if (error) console.error('Error al guardar resultado:', error.message);
  }

  volver() {
    this.router.navigate(['/juegos']);
  }
}
