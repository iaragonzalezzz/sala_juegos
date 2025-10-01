import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../core/supabase.service';
import { AuthService } from '../../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adivina-numero',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    private supabase: SupabaseService,
    private auth: AuthService,
    private router: Router
  ) {}

  nuevoNumero() { return Math.floor(Math.random() * 100) + 1; }

  probar() {
    if (this.finalizado || this.guess == null) return;

    if (this.guess === this.numeroSecreto) {
      this.gano = true;
      this.finalizado = true;
      this.pista = '¡Adivinaste! 🎉';
      this.mostrarModal = true;
      this.guardarResultado();
      return;
    }

    this.intentos--;
    this.pista = this.guess < this.numeroSecreto ? '¡Más alto!' : '¡Más bajo!';

    if (this.intentos === 0) {
      this.finalizado = true;
      this.mostrarModal = true;
      this.guardarResultado();
    }
  }

  async guardarResultado() {
    let usuario = 'Invitado';
    this.auth.user$.subscribe(u => {
      if (u?.email) usuario = u.email;
    }).unsubscribe();

    const puntaje = this.gano ? this.intentos : 0; // más intentos restantes = mejor puntaje
    try {
      await this.supabase.insertar('resultados_propio', {
        usuario,
        puntaje
      });
    } catch {}
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

  volver() { this.router.navigate(['/juegos']); }
}
