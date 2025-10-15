// src/app/components/juegos/chat/message/message.ts
import { Component, Input } from '@angular/core';

export interface Mensaje {
  id: string;
  usuario: string;
  mensaje: string;
  fecha: Date;
  esPropio: boolean;
}

@Component({
  selector: 'app-message',
  standalone: true, // ✅ ¡OBLIGATORIO!
  templateUrl: './message.html',
  styleUrls: ['./message.css']
})
export class MessageComponent {
  @Input() message!: Mensaje;
  formattedTime = '';

  ngOnInit() {
    this.formattedTime = this.message.fecha.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }
}