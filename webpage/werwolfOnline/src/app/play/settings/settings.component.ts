import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { FormControl, Validators } from '@angular/forms';

import { environment } from '../../../environments/environment';
import { LinkService } from '../../services/linkService/link.service';
import { TokenStorageService } from '../../services/tokenStorage/token-storage.service';
import { PlayerManagementService } from '../../services/playerManagement/player-management.service';

import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

import { generateToken } from '../../../apiInterfaces/token';
import { fullRegister } from '../../../apiInterfaces/player';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss', './scss/unauthenticatedBlock.scss', './scss/unauthenticatedBlock/namefield.scss', './scss/errorPopup.scss']
})
export class SettingsComponent implements OnInit {
  access_token: string | undefined;
  refresh_token: string | undefined;
  authenticated: boolean = false;

  maxNameLength: number = 35;

  nickname = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(this.maxNameLength)
  ]);
  volume = new FormControl(0);

  popupOpen = false;

  constructor(
    private player: PlayerManagementService,
    private tokenStorage: TokenStorageService,
    private linkService: LinkService,
    private cookieService: CookieService,
    private router: Router
  ) {
    this.linkService.setLink("/");
  }

  async ngOnInit(): Promise<void> {
    if (environment.production == false) {
      console.log( await this.player.getRedirectPath());
    }

    var redirPath: string = await this.player.getRedirectPath();

    if (redirPath != environment.playerSettingsRoute) {
      this.router.navigate([redirPath]);

      if (environment.production == false) {
        console.log("Redirecting");
      }
    }
  }

  async save(): Promise<void> {
    if (!this.nickname.valid) {
      this.openPopup();
      return;
    }
    this.authenticated = true;
    var genTokens: generateToken | void = await this.player.generateTokens()
      .catch(err => this.errorHandler(err));

    if (typeof genTokens == "undefined") {
      return;
    }

    this.access_token = genTokens.access_token;
    this.refresh_token = genTokens.refresh_token;

    var regPlayer: fullRegister | void = await this.player.fullRegister(this.access_token, this.nickname.value, this.volume.value)
      .catch(err => this.errorHandler(err));

    if (typeof regPlayer == "undefined") {
      return;
    }

    this.tokenStorage.setToken(this.access_token as string, this.refresh_token as string);

    this.router.navigate([environment.playRoute]);
  }

  errorHandler(err: any): void {
    if (environment.production == false) {
      console.log(err);
      this.authenticated = false;
    }

    this.openPopup();
  }

  loadTokens() {
    this.access_token = this.cookieService.get('token');
    this.refresh_token = this.cookieService.get('token_refresh');
  }

  openPopup() {
    this.popupOpen = true;
  }

  closePopup() {
    this.popupOpen = false;
  }
}
