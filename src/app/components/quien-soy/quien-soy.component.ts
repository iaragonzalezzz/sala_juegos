import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './quien-soy.component.html',
  styleUrls: ['./quien-soy.component.css']
})
export class QuienSoyComponent {
  githubUsername = 'iaragonzalezzz';
  user: any = null;
  error: string | null = null;
  loading = true;

  constructor(private http: HttpClient) {
    this.http.get(`https://api.github.com/users/${this.githubUsername}`).subscribe({
      next: (res) => { this.user = res; this.loading = false; },
      error: () => { this.error = 'No se pudo cargar GitHub'; this.loading = false; }
    });
  }
}

