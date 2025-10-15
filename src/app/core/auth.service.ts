import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase: SupabaseClient;
  user$ = new BehaviorSubject<any>(null);

  constructor() {
    // 🔹 Crear cliente global de Supabase
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );

    // 🔹 Cargar usuario inicial
    this.loadUser();

    // 🔹 Detectar login / logout en tiempo real
    this.supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user || null;
      this.user$.next(user);
      if (user) {
        console.log('🟢 Sesión activa:', user.email);
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        console.log('🔴 Sesión cerrada');
        localStorage.removeItem('user');
      }
    });
  }

  // =====================================================
  // 📥 Registrar usuario nuevo
  // =====================================================
  async registrarUsuario(nombre: string, email: string, password: string, apellido?: string, edad?: number) {
    try {
      // 🔸 Combinar nombre y apellido si se pasa por separado
      const nombreCompleto = apellido ? `${nombre} ${apellido}` : nombre;

      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre: nombreCompleto,
            edad: edad || null, // opcional
          },
        },
      });

      if (error) throw error;

      console.log('✅ Usuario registrado:', email);
      return { success: true, data };
    } catch (err: any) {
      console.error('⚠️ Error en registrarUsuario:', err.message);
      return { success: false, error: this.getErrorMessage(err.message) };
    }
  }

  // =====================================================
  // 🔐 Iniciar sesión
  // =====================================================
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      this.user$.next(data.user);
      console.log('✅ Inicio de sesión exitoso:', data.user.email);
      return { success: true, data };
    } catch (err: any) {
      console.error('⚠️ Error al iniciar sesión:', err.message);
      return { success: false, error: this.getErrorMessage(err.message) };
    }
  }

  // =====================================================
  // 🚪 Cerrar sesión
  // =====================================================
  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;
      this.user$.next(null);
      console.log('👋 Sesión cerrada correctamente.');
      return { success: true };
    } catch (err: any) {
      console.error('⚠️ Error al cerrar sesión:', err.message);
      return { success: false, error: this.getErrorMessage(err.message) };
    }
  }

  // =====================================================
  // 👤 Obtener usuario actual
  // =====================================================
  async getUser() {
    try {
      const { data, error } = await this.supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    } catch {
      return null;
    }
  }

  // =====================================================
  // 🔄 Cargar usuario actual (al iniciar la app)
  // =====================================================
  async loadUser() {
    const { data } = await this.supabase.auth.getUser();
    this.user$.next(data.user);
  }

 // 👑 Verificar si el usuario es admin
  async isAdmin(): Promise<boolean> {
    const user = this.user$.value;
    if (!user) return false;

    // 🔹 Buscar el perfil completo en la tabla profiles
    const { data, error } = await this.supabase
      .from('profiles')
      .select('isAdmin')
      .eq('id', user.id)
      .single();

    if (error || !data) return false;

    return data.isAdmin === true;
  }

  // Dentro de la clase AuthService
  async obtenerEncuestas() {
    try {
      const { data, error } = await this.supabase
        .from('encuestas')  // nombre de tu tabla
        .select('*');

      if (error) {
        console.error('Error obteniendo encuestas:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error inesperado al obtener encuestas:', err);
      return [];
    }
  }


  // =====================================================
  // 🧠 Mensajes de error legibles
  // =====================================================
  private getErrorMessage(msg: string): string {
    if (msg.includes('already registered')) return 'Este email ya está registrado.';
    if (msg.includes('invalid email')) return 'El email ingresado es inválido.';
    if (msg.includes('Invalid login credentials')) return 'Email o contraseña incorrectos.';
    if (msg.includes('Email not confirmed')) return 'Verificá tu correo antes de iniciar sesión.';
    return 'Ocurrió un error. Intente nuevamente.';
  }
}

