import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainPageComponent } from './main-page/main-page.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HowToPlayComponent } from './how-to-play/how-to-play.component';

const routes: Routes = [
  {path: '', component: MainPageComponent},
  {path: 'howToPlay', component: HowToPlayComponent},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
