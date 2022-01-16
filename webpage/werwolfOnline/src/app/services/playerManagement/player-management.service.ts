import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { HttpClient } from '@angular/common/http';

import { TokenStorageService } from '../tokenStorage/token-storage.service';

import { generateToken } from '../../../apiInterfaces/token';
import { fullRegister, registrationInformation } from '../../../apiInterfaces/player';
import { joinRoom } from '../../../apiInterfaces/room';

@Injectable({
  providedIn: 'root'
})
export class PlayerManagementService {

  constructor(private client: HttpClient, private tokenStorage: TokenStorageService) { }

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

  getRegistrationInformation(access_token: string): Promise<registrationInformation> {
    return this.getRegistrationInformationObservable(access_token).toPromise();
  }

  getRegistrationInformationObservable(access_token: string): Observable<registrationInformation> {
    var url: string = environment.serverName + environment.api.route + environment.api.player.route + environment.api.player.registrationInformation.route;
    if (environment.api.player.registrationInformation.requiresJWT == true) {
      url = url + "?jwt=" + access_token;
    }
    var req = this.client.get<registrationInformation>(url, {observe: 'body', responseType: 'json'});
    return req;
  }

  joinRoom(access_token: string, roomCode: string = '', isPublic: boolean = false, playerLimit: number = 10): Promise<joinRoom> {
    return this.joinRoomObservable(access_token, roomCode, isPublic, playerLimit).toPromise();
  }

  joinRoomObservable(access_token: string, roomCode: string = '', isPublic: boolean = false, playerLimit: number = 10): Observable<joinRoom> {
    var url: string = environment.serverName + environment.api.route + environment.api.room.route + environment.api.room.join.route;
    if (environment.api.player.fullRegistration.requiresJWT == true) {
      url = url + "?jwt=" + access_token;
    }
    var req = this.client.post<joinRoom>(url, {roomName: roomCode, roomIsPublic: isPublic, roomPlayerLimit: playerLimit}, {observe: 'body', responseType: 'json'});
    return req;
  }

  async getRedirectPath(): Promise<string> {
    await this.tokenStorage.validateTokenFromCookie();

    if (this.tokenStorage.token_valid != true) {
      return environment.playerSettingsRoute;
    } else {
      var info: void | registrationInformation = await this.getRegistrationInformation(this.tokenStorage.token as string)
        .catch(err => { });

      if (info == null) {
        return environment.homePage;
      }
      if (info.inRoom == true) {
        return environment.gameRoute;
      } else {
        return environment.playRoute;
      }
    }


  }
}
