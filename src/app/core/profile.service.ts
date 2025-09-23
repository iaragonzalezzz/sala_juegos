import { Injectable } from '@angular/core';
import { supabase } from './supabase.client';

export interface Profile {
  id: string;     
  email: string;
  first_name?: string;
  last_name?: string;
  age?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {


  async upsertProfile(p: Profile) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(p, { onConflict: 'id' })
      .select();

    if (error) throw error;
    return data?.[0];
  }

  async getMyProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  }
}
