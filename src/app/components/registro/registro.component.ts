import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service'; 

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  usuario = {
    nombre: '',
    apellido: '',
    edad: 0,
    email: '',
    password: '',
    aceptoTerminos: false
  };

  cargando = false;
  mostrarModal = false;
  exito = false;
  mensajeModal = '';

  async onSubmit() {
    if (!this.validarFormulario()) return;

    this.cargando = true;
    try {
      const resultado = await this.authService.registrarUsuario(
       `${this.usuario.nombre} ${this.usuario.apellido}`,
        this.usuario.email,
        this.usuario.password,
        this.usuario.apellido,
        this.usuario.edad
      );
      if (resultado.success) {
        this.exito = true;
        this.mensajeModal = 'Registro exitoso. Revisa tu correo para confirmar.';
      } else {
        this.exito = false;
        this.mensajeModal = resultado.error || 'Error desconocido.';
      }
      this.mostrarModal = true;
    } catch (error) {
      this.exito = false;
      this.mensajeModal = 'Error al registrar usuario.';
    } finally {
      this.cargando = false;
    }
  }

  validarFormulario(): boolean {
    const u = this.usuario;
    if (!u.nombre || !u.apellido || !u.email || !u.password) {
      alert('Todos los campos son obligatorios.');
      return false;
    }
    if (u.edad < 18 || u.edad > 99) {
      alert('La edad debe ser entre 18 y 99 años.');
      return false;
    }
    if (!u.aceptoTerminos) {
      alert('Debe aceptar los términos.');
      return false;
    }
    return true;
  }

  onReset() {
    this.usuario = {
      nombre: '',
      apellido: '',
      edad: 0,
      email: '',
      password: '',
      aceptoTerminos: false
    };
  }

  cerrarModal() {
    this.mostrarModal = false;
    if (this.exito) this.router.navigate(['/login']);
  }
}
