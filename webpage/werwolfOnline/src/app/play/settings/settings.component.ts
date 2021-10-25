import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { FormControl } from '@angular/forms';

import { environment } from '../../../environments/environment';
import { LinkService } from '../../services/linkService/link.service';
import { TokenStorageService } from '../../services/tokenStorage/token-storage.service';

import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

import { generateToken } from '../../../apiInterfaces/token';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  access_token: string | undefined;
  refresh_token: string | undefined;
  authenticated: boolean = false;

  nickname = new FormControl('');
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

  save() {
    this.authenticated = true;
    this.generateTokens()
      .subscribe(
        data => {
          this.access_token = data.access_token;
          this.refresh_token = data.refresh_token;

          this.registerPlayer()
            .subscribe(data => {
              this.setNickname()
                .subscribe(
                  data => {
                    this.setVolume()
                      .subscribe(
                        data => {
                          this.cookieService.set('token', this.access_token as string);
                          this.cookieService.set('token_refresh', this.refresh_token as string);
                          this.tokenStorage.setToken(this.access_token as string, this.refresh_token as string);
                          this.router.navigate(['/play']);
                        }, err => {
                          this.authenticated = false;
                        }
                      );
                  }, err => {
                    this.authenticated = false;
                  }
                );
            }, err => {
              this.authenticated = false;
            });
        }, err => {
          this.authenticated = false;
        }
      )
  }

  generateTokens(): Observable<generateToken> {
    var req = this.client.get<generateToken>(environment.serverName + '/api/token/generate', {observe: 'body', responseType: 'json'});
    return req;
  }

  registerPlayer(): Observable<string> {
    var req = this.client.get<string>(environment.serverName + '/api/player/register?jwt=' + this.access_token, {observe: 'body', responseType: 'json'});

    return req;
  }

  setNickname(): Observable<string> {
    var req = this.client.post<string>(environment.serverName + '/api/player/setNickname?jwt=' + this.access_token, {nickname: this.nickname.value}, {headers: {'Content-Type': 'application/json'}, observe: 'body', responseType: 'json'});
    return req;
  }

  setVolume(): Observable<string> {
    var req = this.client.post<string>(environment.serverName + '/api/player/setVolume?jwt=' + this.access_token, {volume: (this.volume.value)}, {headers: {'Content-Type': 'application/json'}, observe: 'body', responseType: 'json'});
    return req;
  }

  loadTokens() {
    this.access_token = this.cookieService.get('token');
    this.refresh_token = this.cookieService.get('token_refresh');
  }

}
