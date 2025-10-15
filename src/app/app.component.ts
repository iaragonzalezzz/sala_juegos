import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, RouterOutlet } from '@angular/router';
import { SalaChat } from './components/juegos/chat/sala-chat';
import { AuthService } from './core/auth.service';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query } from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SalaChat, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    // Animación para botones
    trigger('botonAnimacion', [
      transition(':enter, :leave', []), // no afecta rutas
    ]),

    // Animación de transición entre rutas
    trigger('routeAnimations', [
      transition('* <=> *', [
        query(':enter, :leave', [
          style({ position: 'absolute', width: '100%' })
        ], { optional: true }),
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' })
        ], { optional: true }),
        query(':leave', [
          animate('200ms ease-out', style({ opacity: 0, transform: 'translateY(-20px)' }))
        ], { optional: true }),
        query(':enter', [
          animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ], { optional: true }),
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  isAdmin = false;
  estadoBotones: { [key: string]: string } = {
    encuesta: 'normal',
    resultadosEncuesta: 'normal',
    ranking: 'normal',
    quienSoy: 'normal'
  };

  constructor(private auth: AuthService, private router: Router) {}

  async ngOnInit() {
    this.isAdmin = await this.auth.isAdmin();
    this.auth.user$.subscribe(() => {
      this.auth.isAdmin().then(admin => this.isAdmin = admin);
    });
  }

  // Navegación de botones
  goToEncuesta() { this.router.navigate(['/encuesta']); }
  goToResultadosEncuesta() { this.router.navigate(['/resultados-encuestas']); }
  goToRanking() { this.router.navigate(['/resultados']); }
  goToQuienSoy() { this.router.navigate(['/quien-soy']); }

  // Animaciones de botones
  onMouseEnter(boton: string) { this.estadoBotones[boton] = 'hover'; }
  onMouseLeave(boton: string) { this.estadoBotones[boton] = 'normal'; }

  // Conecta animación con router-outlet
  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'] || null;
  }
}
