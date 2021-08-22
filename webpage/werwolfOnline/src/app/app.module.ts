import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import { CreateRoomComponent } from './create-room/create-room.component';
import { JoinRoomComponent } from './join-room/join-room.component';
import { GameComponent } from './game/game.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HowToPlayComponent } from './how-to-play/how-to-play.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    CreateRoomComponent,
    JoinRoomComponent,
    GameComponent,
    NotFoundComponent,
    HowToPlayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
