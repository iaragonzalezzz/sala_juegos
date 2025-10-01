import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { QuienSoyComponent } from './components/quien-soy/quien-soy.component';
import { JuegosComponent } from './components/juegos/juegos.component';
import { AhorcadoComponent } from './components/juegos/ahorcado/ahorcado.component';
import { MayorMenorComponent } from './components/juegos/mayor-menor/mayor-menor.component';
import { ChatComponent } from './components/juegos/chat/chat.component';
import { PreguntadosComponent } from './components/juegos/preguntados/preguntados.component';
import { AdivinaNumeroComponent } from './components/juegos/adivina-numero/adivina-numero.component';
import { ResultadosComponent } from './components/resultados/resultados.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'quien-soy', component: QuienSoyComponent },

  { path: 'juegos', component: JuegosComponent },
  { path: 'juegos/ahorcado', component: AhorcadoComponent },
  { path: 'juegos/mayor-menor', component: MayorMenorComponent },
  { path: 'juegos/preguntados', component: PreguntadosComponent },
  { path: 'juegos/adivina-numero', component: AdivinaNumeroComponent },

  { path: 'chat', component: ChatComponent },
  { path: 'resultados', component: ResultadosComponent },

  { path: '**', redirectTo: 'home' }
];
