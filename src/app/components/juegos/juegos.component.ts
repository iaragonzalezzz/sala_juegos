import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-juegos',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './juegos.component.html',
  styleUrls: ['./juegos.component.css']
})
export class JuegosComponent {}
