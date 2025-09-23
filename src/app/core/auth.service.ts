import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { supabase } from './supabase.client';

export interface SessionUser {
  id: string;
  email: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user$ = new BehaviorSubject<SessionUser | null>(null);
  user$ = this._user$.asObservable();

  constructor() {
    // Cargar sesión existente
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      this._user$.next(u ? { id: u.id, email: u.email ?? null } : null);
    });

    // Suscribirse a cambios en la sesión
    supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user;
      this._user$.next(u ? { id: u.id, email: u.email ?? null } : null);
    });
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
}
