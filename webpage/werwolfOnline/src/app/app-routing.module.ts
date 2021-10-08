import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainPageComponent } from './main-page/main-page.component';
import { GameComponent } from './game/game.component';
import { PlayComponent } from './play/play.component';
import { JoinComponent } from './play/join/join.component';
import { CreateComponent } from './play/create/create.component';
import { PlayMainComponent } from './play/play-main/play-main.component';
import { HowToPlayComponent } from './how-to-play/how-to-play.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AboutComponent } from './about/about.component';
import { SettingsComponent } from './play/settings/settings.component';

import { environment } from '../environments/environment';

const routes: Routes = [
  {path: '', component: MainPageComponent, data: {animation: 'MainPage'}},
  {path: 'game', component: GameComponent, data: {animation: 'Game'}},
  {path: 'play', component: PlayComponent, data: {animation: 'Play'}, children: [
    {path: '', component: PlayMainComponent, data: {animation: 'PlayMain'}},
    {path: 'join', component: JoinComponent, data: {animation: 'PlayJoin'}},
    {path: 'create', component: CreateComponent, data: {animation: 'PlayCreate'}},
    {path: 'settings', component: SettingsComponent, data: {animation: 'PlaySettings'}}
  ]},
  {path: 'about', component: AboutComponent, data: {animation: 'About'}},
  {path: 'howToPlay', component: HowToPlayComponent, data: {animation: 'HowToPlay'}},
  {path: '**', component: NotFoundComponent, data: {animation: 'NotFound'}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: environment.useHashLocation})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
