import { Injectable, NgZone } from '@angular/core';
import { supabase } from './supabase.client';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private canal: any;
  private conectado = false;

  constructor(private auth: AuthService, private zone: NgZone) {
    // 🔄 Detectar cambios de sesión en tiempo real
    this.auth.user$.subscribe(() => {
      console.log('🔄 Sesión actualizada, reiniciando canal...');
      this.reiniciarCanal();
    });
  }

  // =====================================================
  // 📩 Obtener usuario actual o "Anónimo"
  // =====================================================
  async obtenerUsuario(): Promise<string> {
    const user = this.auth.user$.value; // usamos BehaviorSubject en lugar de llamar siempre a Supabase
    if (user && user.email) return user.email;
    return 'Anónimo';
  }

  // =====================================================
  // 📜 Obtener los últimos 10 mensajes guardados
  // =====================================================
  async obtenerMensajes() {
    const { data, error } = await supabase
      .from('mensajes_global')
      .select('*')
      .order('fecha', { ascending: false })
      .limit(10); // solo los 10 más recientes

    // Los invertimos para mostrar del más viejo al más nuevo
    return { data: data ? data.reverse() : [], error };
  }

  // =====================================================
  // ✉️ Enviar mensaje nuevo
  // =====================================================
  async enviarMensaje(texto: string): Promise<void> {
    const usuario = await this.obtenerUsuario();
    const fecha = new Date().toISOString();

    const { error } = await supabase.from('mensajes_global').insert([
      { usuario, mensaje: texto, fecha },
    ]);

    if (error) console.error('⚠️ Error enviando mensaje:', error);
  }

  // =====================================================
  // 🔔 Suscribirse a mensajes en tiempo real
  // =====================================================
  suscribirse(callback: (nuevo: any) => void) {
    if (this.canal) this.desuscribirse();

    console.log('📡 Suscribiéndose al canal mensajes_global...');

    this.canal = supabase
      .channel('mensajes_global')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'mensajes_global' },
        (payload) => {
          this.zone.run(() => callback(payload.new));
        }
      )
      .subscribe((status: string) => {
        console.log('📡 Estado del canal:', status);
        this.conectado = status === 'SUBSCRIBED';
      });
  }

  // =====================================================
  // ❌ Cancelar suscripción
  // =====================================================
  desuscribirse() {
    if (this.canal) {
      console.log('❌ Canal cerrado.');
      supabase.removeChannel(this.canal);
      this.canal = null;
      this.conectado = false;
    }
  }

  // =====================================================
  // 🔁 Reiniciar canal al cambiar sesión
  // =====================================================
  private reiniciarCanal() {
    this.desuscribirse();

    // Esperar un poco para que Supabase actualice sesión
    setTimeout(() => {
      this.suscribirse((nuevo: any) => {
        console.log('💬 Nuevo mensaje recibido tras reinicio:', nuevo);
      });
    }, 500);
  }
}
