import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  user$; // observable del usuario

  constructor(private auth: AuthService, private router: Router) {
    this.user$ = this.auth.user$; // nos suscribimos al observable del servicio
  }

  async logout() {
    await this.auth.signOut();
    this.router.navigate(['/home']);
  }
}
