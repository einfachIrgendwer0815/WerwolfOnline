import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { HttpClient } from '@angular/common/http';

import { generateToken } from '../../../apiInterfaces/token';
import { fullRegister } from '../../../apiInterfaces/player';

@Injectable({
  providedIn: 'root'
})
export class PlayerManagementService {

  constructor(private client: HttpClient) { }

  generateTokens(): Promise<generateToken> {
    return this.generateTokensObservable().toPromise();
  }

  generateTokensObservable(): Observable<generateToken> {
    var url: string = environment.serverName + environment.api.route + environment.api.token.route + environment.api.token.generate.route;
    var req = this.client.get<generateToken>(url, {observe: 'body', responseType: 'json'});
    return req;
  }

  fullRegister(access_token: string, nickname: string, volume: number): Promise<fullRegister> {
    return this.fullRegisterObservable(access_token, nickname, volume).toPromise();
  }

  fullRegisterObservable(access_token: string, nickname: string, volume: number): Observable<fullRegister> {
    var url: string = environment.serverName + environment.api.route + environment.api.player.route + environment.api.player.fullRegistration.route;
    if (environment.api.player.fullRegistration.requiresJWT == true) {
      url = url + "?jwt=" + access_token;
    }
    var req = this.client.post<fullRegister>(url, {nickname: nickname, volume: volume}, {headers: {'Content-Type': 'application/json'}, observe: 'body', responseType: 'json'});
    return req;
  }
}
