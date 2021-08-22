import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainPageComponent } from './main-page/main-page.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HowToPlayComponent } from './how-to-play/how-to-play.component';
import { CreateRoomComponent } from './create-room/create-room.component';
import { JoinRoomComponent } from './join-room/join-room.component';
import { GameComponent } from './game/game.component';
import { ImpressumComponent } from './impressum/impressum.component';

const routes: Routes = [
  {path: '', component: MainPageComponent, data: {animation: 'MainPage'}},
  {path: 'howToPlay', component: HowToPlayComponent, data: {animation: 'HowToPlay'}},
  {path: 'create', component: CreateRoomComponent, data: {animation: 'Create'}},
  {path: 'join', component: JoinRoomComponent, data: {animation: 'Join'}},
  {path: 'game', component: GameComponent, data: {animation: 'Game'}},
  {path: 'impressum', component: ImpressumComponent, data: {animation: 'Impressum'}},
  {path: '**', component: NotFoundComponent, data: {animation: 'NotFound'}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
