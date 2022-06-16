import { Component, OnInit } from '@angular/core';

import { PlayerManagementService } from '../services/playerManagement/player-management.service';

import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  private pathSub?: Subscription;
  private roomSub?: Subscription;
  public players: {identity: string, nickname: string}[] = [];

  constructor(private player: PlayerManagementService, private cookieService: CookieService, private router: Router) { }

  ngOnInit(): void {
    this.roomSub = this.player.getRoomInfo().subscribe(data => {
      this.players = data.members as {identity: string, nickname: string}[];
      this.roomSub?.unsubscribe();
    });
    this.pathSub = this.player.getRedirectPath().subscribe(redirPath => {
      if (redirPath != environment.gameRoute) {
        this.router.navigate([redirPath]);

        if (environment.production == false) {
          console.log("Redirecting");
        }
        this.unsubscribeAll();
      }
    });
  }

  unsubscribeAll(): void {
    this.pathSub?.unsubscribe();
    this.roomSub?.unsubscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }
}
