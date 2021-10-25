import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  token: string | undefined;
  refresh_token: string | undefined;
  token_read: boolean = false;
  token_availableInCookie: boolean | undefined;
  token_valid: boolean = false;
  token_set: boolean = false;

  constructor(private cookieService: CookieService, private client: HttpClient) { }

  async validateTokenFromCookie(): Promise<void> {
    if (this.token_set == true || this.token_valid == true) {
      return;
    }
    this.readTokenFromCookie();
    if (this.token_availableInCookie == false) {
      this.token_valid = false;
    } else {
      await this.validateToken();
    }
    if (environment.production == false) {
      console.debug(this);
    }
  }

  async validateToken(): Promise<void> {
    var data = await this.client.get("http://localhost:5000/api/token/getIdentity?jwt=" + this.token, {observe: "body", responseType: 'json'})
      .toPromise()
      .catch(err => {
        this.token_valid = false;
      });
    if(typeof data != "undefined") {
      this.token_valid = true;
    }
  }

  readTokenFromCookie() {
    if(this.token_read == true) {
      return;
    }

    if(this.cookieService.check('token') == true) {
      this.loadTokens();
      this.token_availableInCookie = true;
    } else {
      this.token_availableInCookie = false;
    }
    this.token_read = true;
  }

  loadTokens() {
    this.token = this.cookieService.get('token');
    this.refresh_token = this.cookieService.get('token_refresh');
  }

  setToken(token: string, token_refresh: string) {
    this.token = token;
    this.refresh_token = token_refresh;
    this.token_set = true;
    this.token_valid = true;

    this.cookieService.set('token', token);
    this.cookieService.set('token_refresh', token_refresh);
  }
}
