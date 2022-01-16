import { Component, OnInit } from '@angular/core';
import { LinkService } from '../../services/linkService/link.service';
import { PlayerManagementService } from '../../services/playerManagement/player-management.service';

import { environment } from '../../../environments/environment';

import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-play-main',
  templateUrl: './play-main.component.html',
  styleUrls: ['./play-main.component.scss']
})
export class PlayMainComponent implements OnInit {
  ready: boolean = false;

  constructor(private player: PlayerManagementService, private linkService: LinkService, private cookieService: CookieService, private router: Router) {
    this.linkService.setLink("/");
  }

  async ngOnInit(): Promise<void> {
    if (environment.production == false) {
      console.log( await this.player.getRedirectPath());
    }

    var redirPath: string = await this.player.getRedirectPath();

    if (redirPath != environment.playRoute) {
      this.router.navigate([redirPath]);

      if (environment.production == false) {
        console.log("Redirecting");
      }
    } else {
      this.ready = true;
    }
  }

}
