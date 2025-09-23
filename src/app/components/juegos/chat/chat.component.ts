import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../core/chat.service';
import { supabase } from '../../../core/supabase.client';

interface Mensaje {
  id: string;
  usuario: string;
  mensaje: string;
  creado_en: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  mensajes: Mensaje[] = [];
  nuevoMensaje: string = '';
  usuario: string = 'Anónimo'; // valor por defecto si no hay login

  constructor(private router: Router, private chatService: ChatService) {}

  async ngOnInit() {
    // 🔹 Traer usuario logueado de Supabase
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (user) {
      this.usuario = user.email ?? 'Usuario'; // usamos email o un fallback
    }

    // 🔹 Cargar mensajes
    this.mensajes = await this.chatService.obtenerMensajes();

    // 🔹 Escuchar mensajes en tiempo real
    this.chatService.escucharMensajes((payload: any) => {
      this.mensajes.push(payload.new);
    });
  }

  async enviarMensaje() {
    if (this.nuevoMensaje.trim() !== '') {
      await this.chatService.enviarMensaje(this.usuario, this.nuevoMensaje);
      this.nuevoMensaje = '';
    }
  }

  volver() {
    this.router.navigate(['/juegos']);
  }
}


