import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from  '@angular/platform-browser/animations';

import { CookieService } from 'ngx-cookie-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import { GameComponent } from './game/game.component';
import { PlayComponent } from './play/play.component';
import { JoinComponent } from './play/join/join.component';
import { CreateComponent } from './play/create/create.component';
import { PlayMainComponent } from './play/play-main/play-main.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HowToPlayComponent } from './how-to-play/how-to-play.component';
import { AboutComponent } from './about/about.component';
import { SettingsComponent } from './play/settings/settings.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LinkService } from './services/linkService/link.service';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    GameComponent,
    PlayComponent,
    JoinComponent,
    CreateComponent,
    PlayMainComponent,
    NotFoundComponent,
    HowToPlayComponent,
    AboutComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FontAwesomeModule
  ],
  providers: [LinkService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
