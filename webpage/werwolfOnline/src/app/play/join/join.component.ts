import { Component, OnInit } from '@angular/core';
import { LinkService } from '../../services/linkService/link.service';

import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

import { PlayerManagementService } from '../../services/playerManagement/player-management.service';
import { TokenStorageService } from '../../services/tokenStorage/token-storage.service';
import { environment } from '../../../environments/environment';

import { HttpClient } from '@angular/common/http';
import { publics } from '../../../apiInterfaces/room';

import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent implements OnInit {
  tableData: Array<Array<string|number>> = [];
  blockInput: boolean = false;

  maxCodeLength: number = 10;
  minCodeLength: number = 10;

  code: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(this.minCodeLength),
    Validators.maxLength(this.maxCodeLength)
  ]);

  constructor(private player: PlayerManagementService, private linkService: LinkService, private router: Router, private client: HttpClient, private token: TokenStorageService) {
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

  async join(code: string) {
    if (!this.blockInput) {
      this.blockInput = true;
    } else {
      return;
    }

    this.player.joinRoomObservable(this.token.token as string, code)
      .subscribe(async data => {
        if (environment.production == false) {
          console.log(data);
        }
        if (data.successful == true) {
          var path = await this.player.getRedirectPath();
          this.router.navigate([path]);
        } else {
          this.blockInput = false;
        }
      }, err => {
        console.log(err);
        this.blockInput = false;
      });
  }

  async joinPrivate() {
    if (!this.blockInput) {
      this.blockInput = true;
    } else {
      return;
    }

    if (!this.code.valid) {
      this.blockInput = false;
      return;
    }

    this.player.joinRoomObservable(this.token.token as string, this.code.value)
      .subscribe(async data => {
        if (environment.production == false) {
          console.log(data);
        }
        if (data.successful == true) {
          var path = await this.player.getRedirectPath();
          this.router.navigate([path]);
        } else {
          this.blockInput = false;
        }
      }, err => {
        console.log(err);
        this.blockInput = false;
      });
  }
}
