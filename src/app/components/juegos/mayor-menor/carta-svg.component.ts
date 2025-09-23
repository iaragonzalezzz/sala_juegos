import { Component, Input } from '@angular/core';

interface Carta {
  valor: number;
  palo: string; // ♥ ♦ ♣ ♠
}

@Component({
  selector: 'app-carta-svg',
  standalone: true,
  template: `
    <svg width="100" height="150" viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">
      <!-- Fondo de la carta -->
      <rect width="100" height="150" rx="10" ry="10" fill="white" stroke="black" />

      <!-- Valor arriba a la izquierda -->
      <text x="10" y="20" font-size="14" [attr.fill]="colorPalo">{{ carta?.valor }}</text>
      <text x="10" y="40" font-size="18" [attr.fill]="colorPalo">{{ carta?.palo }}</text>

      <!-- Palo grande en el centro -->
      <text x="50" y="85" text-anchor="middle" font-size="40" [attr.fill]="colorPalo">{{ carta?.palo }}</text>

      <!-- Valor abajo a la derecha -->
      <text x="90" y="140" font-size="14" text-anchor="end" [attr.fill]="colorPalo">{{ carta?.valor }}</text>
      <text x="90" y="120" font-size="18" text-anchor="end" [attr.fill]="colorPalo">{{ carta?.palo }}</text>
    </svg>
  `,
  styles: [`
    svg {
      margin: 8px;
    }
  `]
})
export class CartaSvgComponent {
  @Input() carta: Carta | null = null;

  get colorPalo(): string {
    if (!this.carta) return 'black';
    return (this.carta.palo === '♥' || this.carta.palo === '♦') ? 'red' : 'black';
  }
}

