import { Injectable } from '@angular/core';
import { supabase } from './supabase.client';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  //guarda o actualiza el perfil
  async upsertProfile(profile: any) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profile);

    if (error) console.error('Error al guardar perfil:', error.message);
    else console.log('Perfil guardado/actualizado correctamente ✅');

    return data;
  }

  //obtiene el perfil de un usuario por su ID
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) console.error('Error obteniendo perfil:', error.message);
    return data;
  }
}
