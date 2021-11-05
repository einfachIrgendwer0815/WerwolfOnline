import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { FormControl, Validators } from '@angular/forms';

import { environment } from '../../../environments/environment';
import { LinkService } from '../../services/linkService/link.service';
import { TokenStorageService } from '../../services/tokenStorage/token-storage.service';

import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

import { generateToken } from '../../../apiInterfaces/token';
import { fullRegister } from '../../../apiInterfaces/player';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  access_token: string | undefined;
  refresh_token: string | undefined;
  authenticated: boolean = false;

  nickname = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ]);
  volume = new FormControl(0);

  constructor(private tokenStorage: TokenStorageService, private linkService: LinkService, private client: HttpClient, private cookieService: CookieService, private router: Router) {
    this.linkService.setLink("/");
  }

  async ngOnInit(): Promise<void> {
    await this.tokenStorage.validateTokenFromCookie();

    if (this.tokenStorage.token_valid == true) {
      this.router.navigate(['/play']);
    }
  }

  async save(): Promise<void> {
    if (!this.nickname.valid) {
      return;
    }
    this.authenticated = true;
    var genTokens: generateToken | void = await this.generateTokens().toPromise()
      .catch(err => this.errorHandler(err));

    if (typeof genTokens == "undefined") {
      return;
    }

    this.access_token = genTokens.access_token;
    this.refresh_token = genTokens.refresh_token;

    var regPlayer: fullRegister | void = await this.registerPlayer().toPromise()
      .catch(err => this.errorHandler(err));

    if (typeof regPlayer == "undefined") {
      return;
    }

    this.tokenStorage.setToken(this.access_token as string, this.refresh_token as string);

    this.router.navigate(['/play']);
  }

  errorHandler(err: any): void {
    if (environment.production == false) {
      console.log(err);
      this.authenticated = false;
    }
  }

  generateTokens(): Observable<generateToken> {
    var req = this.client.get<generateToken>(environment.serverName + '/api/token/generate', {observe: 'body', responseType: 'json'});
    return req;
  }

  registerPlayer(): Observable<fullRegister> {
    var req = this.client.post<fullRegister>(environment.serverName + '/api/player/fullRegister?jwt=' + this.access_token, {nickname: this.nickname.value, volume: this.volume.value}, {headers: {'Content-Type': 'application/json'}, observe: 'body', responseType: 'json'});

    return req;
  }

  loadTokens() {
    this.access_token = this.cookieService.get('token');
    this.refresh_token = this.cookieService.get('token_refresh');
  }

}
