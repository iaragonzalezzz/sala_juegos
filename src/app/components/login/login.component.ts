import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loading = false;
  errorMsg = '';
  form;

  quickUsers = [
    { email: 'tester1@example.com', password: 'secret123' },
    { email: 'tester2@example.com', password: 'secret123' },
    { email: 'tester3@example.com', password: 'secret123' }
  ];

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async submit() {
    this.errorMsg = '';
    if (this.form.invalid) return;
    this.loading = true;
    try {
      const { email, password } = this.form.value as any;
      await this.auth.signIn(email, password);
      this.router.navigate(['/home']);
    } catch (e: any) {
      this.errorMsg = e.message ?? 'Error al iniciar sesión';
    } finally {
      this.loading = false;
    }
  }

  async quickLogin(u: { email: string; password: string }) {
    this.form.setValue({ email: u.email, password: u.password });
    await this.submit();
  }
}


