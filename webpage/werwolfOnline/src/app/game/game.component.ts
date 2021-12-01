import { Component, OnInit } from '@angular/core';

import { PlayerManagementService } from '../services/playerManagement/player-management.service';

import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  constructor(private player: PlayerManagementService, private cookieService: CookieService, private router: Router) { }

  async ngOnInit(): Promise<void> {
    if (environment.production == false) {
      console.log( await this.player.getRedirectPath());
    }

    var redirPath: string = await this.player.getRedirectPath();

    if (redirPath != environment.gameRoute) {
      this.router.navigate([redirPath]);

      if (environment.production == false) {
        console.log("Redirecting");
      }
    }
  }
}
