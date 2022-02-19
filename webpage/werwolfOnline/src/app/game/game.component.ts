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

  constructor(private player: PlayerManagementService, private cookieService: CookieService, private router: Router) { }

  ngOnInit(): void {
    this.pathSub = this.player.getRedirectPath().subscribe(redirPath => {
      if (redirPath != environment.gameRoute) {
        this.router.navigate([redirPath]);

        if (environment.production == false) {
          console.log("Redirecting");
          this.pathSub?.unsubscribe();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.pathSub?.unsubscribe();
  }
}
