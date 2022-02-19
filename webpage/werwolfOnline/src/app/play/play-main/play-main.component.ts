import { Component, OnInit } from '@angular/core';
import { LinkService } from '../../services/linkService/link.service';
import { PlayerManagementService } from '../../services/playerManagement/player-management.service';

import { environment } from '../../../environments/environment';

import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-play-main',
  templateUrl: './play-main.component.html',
  styleUrls: ['./play-main.component.scss']
})
export class PlayMainComponent implements OnInit {
  ready: boolean = false;
  private pathSub?: Subscription;

  constructor(private player: PlayerManagementService, private linkService: LinkService, private cookieService: CookieService, private router: Router) {
    this.linkService.setLink("/");
  }

  ngOnInit(): void {
    if (environment.production == false) {
    }

    this.pathSub = this.player.getRedirectPath().subscribe(redirPath => {
      if (redirPath != environment.playRoute) {
        this.router.navigate([redirPath]);

        if (environment.production == false) {
          console.log("Redirecting");
          this.pathSub?.unsubscribe();
        }
      } else {
        this.ready = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.pathSub?.unsubscribe();
  }
}
