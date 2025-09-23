// src/app/core/chat.service.ts
import { Injectable } from '@angular/core';
import { supabase } from './supabase.client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  async obtenerMensajes() {
    const { data, error } = await supabase
      .from('chat_mensajes')
      .select('*')
      .order('creado_en', { ascending: true });

    if (error) {
      console.error('Error cargando mensajes:', error);
      return [];
    }
    return data || [];
  }

  async enviarMensaje(usuario: string, mensaje: string) {
    const { error } = await supabase
      .from('chat_mensajes')
      .insert([{ usuario, mensaje }]);

    if (error) console.error('Error enviando mensaje:', error);
  }

  escucharMensajes(callback: (payload: any) => void) {
    return supabase
      .channel('chat-room')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_mensajes' },
        (payload) => callback(payload)
      )
      .subscribe();
  }
}

