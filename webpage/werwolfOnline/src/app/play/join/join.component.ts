import { Component, OnInit } from '@angular/core';
import { LinkService } from '../../services/linkService/link.service';

import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

import { PlayerManagementService } from '../../services/playerManagement/player-management.service';
import { environment } from '../../../environments/environment';

import { HttpClient } from '@angular/common/http';
import { publics, doesRoomExist } from '../../../apiInterfaces/room';

import { FormControl, Validators } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';

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

  private pathSub?: Subscription;

  constructor(private player: PlayerManagementService, private linkService: LinkService, private router: Router, private client: HttpClient) {
    this.linkService.setLink("/play");
  }

  ngOnInit(): void {
    this.pathSub = this.player.getRedirectPath().subscribe(redirPath => {
      if (redirPath != environment.playRoute) {
        this.router.navigate([redirPath]);

        if (environment.production == false) {
          console.log("Redirecting");
          this.pathSub?.unsubscribe();
        }
      }
    });

    this.loadPublicList();
  }

  ngOnDestroy(): void {
    this.pathSub?.unsubscribe();
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

    this.player.joinRoomObservable(code)
      .subscribe(async data => {
        if (environment.production == false) {
          console.log(data);
        }
        if (data.successful == false) {
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

    var url: string = environment.serverName + environment.api.route + environment.api.room.route + environment.api.room.doesRoomExist.route;
    var req = this.client.post<doesRoomExist>(url, {roomName: this.code.value} ,{observe: 'body', responseType: 'json'})
      .subscribe(async data => {
        if (environment.production == false) {
          console.log(data);
        }

        if (data.exists == true) {
          await this.doPrivateJoin();
        } else {
          this.blockInput = false;
        }
      }, err => {
        this.blockInput = false;
      });
  }

  async doPrivateJoin() {
    this.player.joinRoomObservable(this.code.value)
      .subscribe(async data => {
        if (environment.production == false) {
          console.log(data);
        }
        if (data.successful == false) {
          this.blockInput = false;
        }
      }, err => {
        console.log(err);
        this.blockInput = false;
      });
  }
}
