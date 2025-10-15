import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { supabase } from '../../core/supabase.client';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule] // necesario para *ngIf, *ngFor, ngModel, ngForm
})
export class EncuestaComponent {
  // Datos de la encuesta
  encuesta = {
    nombre_apellido: '',
    edad: null as number | null,
    telefono: '',
    pregunta1: '',           // experiencia
    pregunta2: [] as string[], // juegos favoritos
    pregunta3: ''            // recomendación
  };

  // Juegos disponibles
  juegos = ['Preguntados', 'Mayor o Menor', 'Ahorcado'];

  mensaje = '';

  constructor(private auth: AuthService) {}

  // Toggle selección de juegos
  toggleJuego(juego: string, event: any) {
    if (event.target.checked) {
      this.encuesta.pregunta2.push(juego);
    } else {
      this.encuesta.pregunta2 = this.encuesta.pregunta2.filter(j => j !== juego);
    }
  }

  // Enviar encuesta
  async enviarEncuesta() {
    const user = await this.auth.getUser();
    if (!user) {
      this.mensaje = 'Debes iniciar sesión para enviar la encuesta.';
      return;
    }

    // Validaciones
    if (
      !this.encuesta.nombre_apellido ||
      !this.encuesta.edad ||
      !this.encuesta.telefono ||
      !this.encuesta.pregunta1 ||
      this.encuesta.pregunta2.length === 0 || // debe seleccionar al menos un juego
      !this.encuesta.pregunta3
    ) {
      this.mensaje = 'Por favor, completá todos los campos.';
      return;
    }

    if (this.encuesta.edad < 18 || this.encuesta.edad > 99) {
      this.mensaje = 'La edad debe estar entre 18 y 99 años.';
      return;
    }

    if (!/^[0-9]+$/.test(this.encuesta.telefono) || this.encuesta.telefono.length > 10) {
      this.mensaje = 'El teléfono debe contener solo números (máx. 10 dígitos).';
      return;
    }

    // Guardar en la tabla 'encuestas'
    const { error } = await supabase.from('encuestas').insert([
      {
        ...this.encuesta,
        usuario_id: user.id
      }
    ]);

    if (error) {
      console.error(error);
      this.mensaje = 'Hubo un error al guardar la encuesta.';
    } else {
      this.mensaje = 'Encuesta enviada con éxito. ¡Gracias por participar!';
      // Resetear encuesta
      this.encuesta = { nombre_apellido: '', edad: null, telefono: '', pregunta1: '', pregunta2: [], pregunta3: '' };
    }
  }
}
