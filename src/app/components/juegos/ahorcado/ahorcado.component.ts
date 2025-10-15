import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { supabase } from '../../../core/supabase.client';
import { AuthService } from '../../../core/auth.service';
import { SalaChat } from '../chat/sala-chat';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule, SalaChat],
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.css']
})
export class AhorcadoComponent {
  letras = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  palabras = ['ANGULAR', 'JUEGO', 'COMPONENTE', 'SERVICIO', 'TEMPLATES', 'ROUTER', 'PIPE'];
  palabra = '';
  letrasAdivinadas = new Set<string>();
  letrasIncorrectas = new Set<string>();
  errores = 0;
  maxErrores = 6;
  victoria = false;
  derrota = false;
  tiempo = 60;
  private intervalo?: any;

  constructor(
    private router: Router,
    private auth: AuthService
  ) {
    this.reiniciar();
  }

  private elegirPalabra() {
    const i = Math.floor(Math.random() * this.palabras.length);
    this.palabra = this.palabras[i];
  }

  get guiones(): string[] {
    return this.palabra.split('').map(l => (this.letrasAdivinadas.has(l) ? l : '_'));
  }

  get juegoTerminado(): boolean {
    return this.victoria || this.derrota;
  }

  presionar(letra: string) {
    if (this.juegoTerminado || this.letrasAdivinadas.has(letra) || this.letrasIncorrectas.has(letra)) return;

    if (this.palabra.includes(letra)) {
      this.letrasAdivinadas.add(letra);
      if (this.palabra.split('').every(l => this.letrasAdivinadas.has(l))) {
        this.victoria = true;
        this.pararReloj();
        this.guardarResultado();
      }
    } else {
      this.letrasIncorrectas.add(letra);
      this.errores++;
      if (this.errores >= this.maxErrores) {
        this.derrota = true;
        this.pararReloj();
        this.guardarResultado();
      }
    }
  }

  async guardarResultado() {
    const usuario = this.auth.user$.value?.email || 'Anónimo';
    const puntaje = this.victoria ? this.tiempo : 0;
    const fecha = new Date().toISOString();

    const { error } = await supabase.from('resultados_ahorcado').insert([{ usuario, puntaje, fecha }]);
    if (error) console.error('Error al guardar resultado:', error.message);
  }

  reiniciar() {
    this.pararReloj();
    this.elegirPalabra();
    this.letrasAdivinadas.clear();
    this.letrasIncorrectas.clear();
    this.errores = 0;
    this.victoria = false;
    this.derrota = false;
    this.tiempo = 60;
    this.arrancarReloj();
  }

  volver() {
    this.pararReloj();
    this.router.navigate(['/juegos']);
  }

  private arrancarReloj() {
    this.intervalo = setInterval(() => {
      this.tiempo--;
      if (this.tiempo <= 0) {
        this.tiempo = 0;
        this.derrota = true;
        this.pararReloj();
        this.guardarResultado();
      }
    }, 1000);
  }

  private pararReloj() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
      this.intervalo = undefined;
    }
  }
}
