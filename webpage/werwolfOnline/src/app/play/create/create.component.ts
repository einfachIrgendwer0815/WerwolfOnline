import { Component, OnInit } from '@angular/core';
import { LinkService } from '../../services/linkService/link.service';

import { PlayerManagementService } from '../../services/playerManagement/player-management.service';

import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  constructor(private player: PlayerManagementService, private linkService: LinkService, private cookieService: CookieService, private router: Router) {
    this.linkService.setLink("/play");
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
    }
  }

}
