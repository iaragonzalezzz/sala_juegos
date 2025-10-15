import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { supabase } from '../../../core/supabase.client';
import { AuthService } from '../../../core/auth.service';
import { SalaChat } from '../chat/sala-chat';

@Component({
  selector: 'app-adivina-numero',
  standalone: true,
  imports: [CommonModule, FormsModule, SalaChat],
  templateUrl: './adivina-numero.component.html',
  styleUrls: ['./adivina-numero.component.css']
})
export class AdivinaNumeroComponent {
  numeroSecreto = this.nuevoNumero();
  intentosMax = 7;
  intentos = this.intentosMax;
  guess: number | null = null;
  pista = '';
  finalizado = false;
  gano = false;
  mostrarModal = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  nuevoNumero() { return Math.floor(Math.random() * 100) + 1; }

  probar() {
    if (this.finalizado || this.guess == null) return;

    if (this.guess === this.numeroSecreto) {
      this.gano = true;
      this.finalizado = true;
      this.pista = '¡Adivinaste!';
      this.mostrarModal = true;
      this.guardarResultado();
      return;
    }

    this.intentos--;
    this.pista = this.guess < this.numeroSecreto ? 'Más alto' : 'Más bajo';

    if (this.intentos === 0) {
      this.finalizado = true;
      this.mostrarModal = true;
      this.guardarResultado();
    }
  }

  async guardarResultado() {
    const usuario = this.auth.user$.value?.email || 'Anónimo';
    const puntaje = this.gano ? this.intentos : 0;
    const fecha = new Date().toISOString();

    const { error } = await supabase.from('resultados_adivina').insert([{ usuario, puntaje, fecha }]);
    if (error) console.error('Error al guardar resultado:', error.message);
  }

  reiniciar() {
    this.numeroSecreto = this.nuevoNumero();
    this.intentos = this.intentosMax;
    this.guess = null;
    this.pista = '';
    this.finalizado = false;
    this.gano = false;
    this.mostrarModal = false;
  }

  volver() {
    this.router.navigate(['/juegos']);
  }
}
