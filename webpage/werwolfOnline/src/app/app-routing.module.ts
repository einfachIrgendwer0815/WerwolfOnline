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

const routes: Routes = [
  {path: '', component: MainPageComponent},
  {path: 'game', component: GameComponent},
  {path: 'play', component: PlayComponent, children: [
    {path: '', component: PlayMainComponent},
    {path: 'join', component: JoinComponent},
    {path: ' create', component: CreateComponent}
  ]},
  {path: 'howToPlay', component: HowToPlayComponent},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
