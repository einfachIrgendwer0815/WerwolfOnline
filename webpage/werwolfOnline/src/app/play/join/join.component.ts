import { Component, OnInit } from '@angular/core';
import { LinkService } from '../../services/linkService/link.service';

import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

import { PlayerManagementService } from '../../services/playerManagement/player-management.service';
import { environment } from '../../../environments/environment';

import { HttpClient } from '@angular/common/http';
import { publics } from '../../../apiInterfaces/room';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent implements OnInit {
  tableData: Array<Array<string|number>> = [];

  constructor(private player: PlayerManagementService, private linkService: LinkService, private cookieService: CookieService, private router: Router, private client: HttpClient) {
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

      return;
    }

    this.loadPublicList();
  }

  loadPublicList(): void {
    var url: string = environment.serverName + environment.api.route + environment.api.room.route + environment.api.room.publics.route;
    var req = this.client.get<publics>(url, {observe: 'body', responseType: 'json'})
      .subscribe(data => {
        this.tableData = data.rooms;
      }, err => {

      });
  }

}
