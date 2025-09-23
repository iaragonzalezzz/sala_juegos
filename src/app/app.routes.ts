import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { QuienSoyComponent } from './components/quien-soy/quien-soy.component';
import { JuegosComponent } from './components/juegos/juegos.component';
import { AhorcadoComponent } from './components/juegos/ahorcado/ahorcado.component';
import { MayorMenorComponent } from './components/juegos/mayor-menor/mayor-menor.component';
import { ChatComponent } from './components/juegos/chat/chat.component';



export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'quien-soy', component: QuienSoyComponent },
  { path: 'juegos', component: JuegosComponent },
  { path: 'juegos/ahorcado', component: AhorcadoComponent },
  { path: 'juegos/mayor-menor', component: MayorMenorComponent },
  { path: 'chat', component: ChatComponent }
];
