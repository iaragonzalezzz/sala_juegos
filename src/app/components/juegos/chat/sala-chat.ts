// src/app/components/juegos/chat/sala-chat.ts
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageComponent } from './message/message';
import { supabase } from '../../../core/supabase.client';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-sala-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MessageComponent],
  templateUrl: './sala-chat.html',
  styleUrls: ['./sala-chat.css']
})
export class SalaChat implements OnInit, OnDestroy {
  visible = signal(false); // ✅ Signal para controlar visibilidad
  texto = '';
  mensajes: any[] = [];
  limite = 80;
  error = '';
  private canal: any = null;

  constructor(private auth: AuthService) {}

  async ngOnInit() {
    const user = this.auth.user$.value;
    if (!user) {
      this.error = 'Debes iniciar sesión para usar el chat.';
      return;
    }
    await this.cargarMensajes();
    this.suscribirse();
  }

  async cargarMensajes() {
    const { data, error } = await supabase
      .from('mensajes_global')
      .select('*')
      .order('fecha', { ascending: false })
      .limit(10);

    if (error) return;

    const user = this.auth.user$.value;
    this.mensajes = data.reverse().map(m => ({
      id: m.id,
      usuario: m.usuario,
      mensaje: m.mensaje,
      fecha: new Date(m.fecha),
      esPropio: m.usuario === user?.email
    }));
  }

  suscribirse() {
    this.canal = supabase
      .channel('mensajes_global')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'mensajes_global' },
        (payload) => {
          const nuevo = payload.new as any;
          const user = this.auth.user$.value;
          const msg = {
            id: nuevo.id,
            usuario: nuevo.usuario,
            mensaje: nuevo.mensaje,
            fecha: new Date(nuevo.fecha),
            esPropio: nuevo.usuario === user?.email
          };
          this.mensajes = [...this.mensajes, msg].slice(-10);
          this.scrollAbajo();
        }
      )
      .subscribe();
  }

  async enviar() {
  const t = this.texto.trim();
  if (!t || t.length > this.limite) {
    this.error = `Máx ${this.limite} caracteres.`;
    return;
  }

  const user = this.auth.user$.value;
  if (!user) {
    this.error = 'Debes iniciar sesión para enviar mensajes.';
    return;
  }

  try {
    await supabase.from('mensajes_global').insert({
      usuario: user.email,
      mensaje: t,
      fecha: new Date().toISOString()
    });
    this.texto = '';
    this.error = '';
    // Actualiza la lista de mensajes
    await this.cargarMensajes();
    } catch (err: any) {
      console.error('Error al enviar mensaje:', err);
      this.error = 'No se pudo enviar el mensaje.';
    }
  }

  toggleChat() {
    this.visible.set(!this.visible()); // ✅ Cambia el estado de visibilidad
    if (this.visible()) {
      setTimeout(() => this.scrollAbajo(), 300);
    }
  }

  scrollAbajo() {
    const el = document.querySelector('.chat-mensajes');
    if (el) el.scrollTop = el.scrollHeight;
  }

  ngOnDestroy() {
    if (this.canal) supabase.removeChannel(this.canal);
  }
}