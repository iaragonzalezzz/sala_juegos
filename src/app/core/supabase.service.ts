import { Injectable } from '@angular/core';
import { supabase } from './supabase.client';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  async insertar(tabla: string, data: Record<string, any>) {
    const { error } = await supabase.from(tabla).insert(data);
    if (error) throw error;
  }

  async obtener(tabla: string) {
    const { data, error } = await supabase
      .from(tabla)
      .select('*')
      .order('puntaje', { ascending: false })
      .order('fecha', { ascending: false });
    if (error) throw error;
    return data ?? [];
  }
}
