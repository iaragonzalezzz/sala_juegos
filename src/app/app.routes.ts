import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { QuienSoyComponent } from './components/quien-soy/quien-soy.component';
import { JuegosComponent } from './components/juegos/juegos.component';
import { AhorcadoComponent } from './components/juegos/ahorcado/ahorcado.component';
import { MayorMenorComponent } from './components/juegos/mayor-menor/mayor-menor.component';
import { SalaChat } from './components/juegos/chat/sala-chat';
import { PreguntadosComponent } from './components/juegos/preguntados/preguntados.component';
import { AdivinaNumeroComponent } from './components/juegos/adivina-numero/adivina-numero.component';
import { ResultadosComponent } from './components/resultados/resultados.component';


import { AuthGuard } from './core/auth.guard';
import { AdminGuard } from './core/admin.guard'; 
import { EncuestaComponent } from './components/encuesta/encuesta.component';
import { ResultadosEncuestaComponent } from './components/resultados-encuestas/resultados-encuestas.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'quien-soy', component: QuienSoyComponent },


  //(solo logueados)
  { path: 'juegos', component: JuegosComponent, canActivate: [AuthGuard] },
  { path: 'juegos/ahorcado', component: AhorcadoComponent, canActivate: [AuthGuard] },
  { path: 'juegos/mayor-menor', component: MayorMenorComponent, canActivate: [AuthGuard] },
  { path: 'juegos/preguntados', component: PreguntadosComponent, canActivate: [AuthGuard] },
  { path: 'juegos/adivina-numero', component: AdivinaNumeroComponent, canActivate: [AuthGuard] },
  { path: 'chat', component: SalaChat, canActivate: [AuthGuard] },
  { path: 'resultados', component: ResultadosComponent, canActivate: [AuthGuard] },
  { path: 'encuesta', component: EncuestaComponent, canActivate: [AuthGuard] }, // ✅ Nueva ruta

  //(solo para administradores)
  { path: 'resultados-encuestas', component: ResultadosEncuestaComponent, canActivate: [AdminGuard] }, // ✅ Nueva ruta

  { path: '**', redirectTo: 'home' }
];