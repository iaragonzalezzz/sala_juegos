import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { ProfileService } from '../../core/profile.service';
import { supabase } from '../../core/supabase.client';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  loading = false;
  errorMsg = '';
  form;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private profile: ProfileService,
    private router: Router
  ) {
    this.form = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      age: [null as number | null, [Validators.required, Validators.min(1)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async submit() {
    this.errorMsg = '';
    if (this.form.invalid) return;
    this.loading = true;

    try {
      const { first_name, last_name, age, email, password } = this.form.value as any;

      await this.auth.signUp(email, password);

      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) throw new Error('No hay sesión activa');

      await this.profile.upsertProfile({
        id: user.id,
        email,
        first_name,
        last_name,
        age: Number(age)
      });

      this.router.navigate(['/home']);
    } catch (e: any) {
      this.errorMsg = e?.message?.includes('already registered')
        ? 'El usuario ya está registrado.'
        : (e.message ?? 'Error en el registro');
    } finally {
      this.loading = false;
    }
  }
}


