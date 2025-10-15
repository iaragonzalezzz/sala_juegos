import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { SalaChat } from '../juegos/chat/sala-chat';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, SalaChat],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  user$; 

  constructor(private auth: AuthService, private router: Router) {
    this.user$ = this.auth.user$; 
  }

  async logout() {
    await this.auth.signOut();
    this.router.navigate(['/home']);
  }
}
