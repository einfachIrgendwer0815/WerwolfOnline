import { Injectable } from '@angular/core';
import { Observable, Observer, of } from 'rxjs';
import { retryWhen, flatMap, delay } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { HttpClient } from '@angular/common/http';

import { TokenStorageService } from '../tokenStorage/token-storage.service';
import { CookieService } from 'ngx-cookie-service';

import { generateToken, identityInformation } from '../../../apiInterfaces/token';
import { fullRegister, registrationInformation } from '../../../apiInterfaces/player';
import { joinRoom } from '../../../apiInterfaces/room';

const TOKEN_ACCESS_COOKIE_NAME: string = "token";
const TOKEN_REFRESH_COOKIE_NAME: string = "token_refresh";
const TOKEN_PATH: string = "/";
const DELETE_COOKIE_ON_ERROR: boolean = false;

@Injectable({
  providedIn: 'root'
})
export class PlayerManagementService {
  private token_access?: string;
  private token_refresh?: string;
  private tokenInCookie: boolean = false;
  private playerInformation: { [id: string]: string|number|boolean } = {};
  private playerInformationAvailable: boolean = false;
  private roomInformation?: { [id: string]: string|number|boolean };

  constructor(private client: HttpClient, private cookieService: CookieService, private tokenStorage: TokenStorageService) {
    this.initialize();
    if(environment.production == false) {
      console.log(this);

      setInterval(() => {
        console.log(this);
      }, 5000);

    }

    setInterval(() => {
      this.initialize();
    }, 10000)
  }

  public getNickname(): Observable<string> {
    return new Observable<string>((observer: Observer<string>) => {
      var returnIfAvailable = (interval?: number) => {
        console.log("abc");
        if(this.playerInformation.nickname != undefined) {
          observer.next(this.playerInformation.nickname as string);

          if(interval != undefined) {
            clearInterval(interval);
          }
        }
      };

      var interval = setInterval(() => { returnIfAvailable(interval); }, 50);
    });
  }

  private initialize() {
    this.readTokensFromCookie();

    if(this.tokensAvailable()) {
      this.validateToken(
        (data: identityInformation) => {
          this.loadPlayerInformation();
        },
        (err: any) => {
          this.token_access = undefined;
          this.token_refresh = undefined;
          this.tokenInCookie = false;
          this.playerInformation['registered'] = false;
          this.roomInformation = undefined;
          if(DELETE_COOKIE_ON_ERROR) this.clearCookies();
        }
      );
    }
  }

  private validateToken(onValid: any, onInvalid: any): void {
    if (!this.tokensAvailable()) {
      onInvalid();
    }

    var url: string = environment.serverName + environment.api.route + environment.api.token.route + environment.api.token.identityInformation.route;
    url += '?jwt=' + this.token_access;
    var resp: Observable<identityInformation> = this.client.get<identityInformation>(url, {observe: 'body', responseType: 'json'});
    resp = this.applyRetry(resp, 2, 5000);

    resp.subscribe(data => {
      onValid(data);
    }, err => {
      onInvalid(err);
    })
  }

  private loadPlayerInformation(): void {
    if (!this.tokensAvailable()) {
      return;
    }

    var url: string = environment.serverName + environment.api.route + environment.api.player.route + environment.api.player.registrationInformation.route;
    url += '?jwt=' + this.token_access;
    var resp: Observable<registrationInformation> = this.client.get<registrationInformation>(url);
    resp = this.applyRetry(resp, 5, 5000);

    resp.subscribe(data => {
      if(data.isRegistered == false) {
        this.playerInformation['registered'] = false;
      } else {
        this.playerInformation['registered'] = true;
        this.playerInformation['nickname'] = data.nicknameSet as string;
        this.playerInformation['volume'] = data.volumeSet as number;
        this.playerInformation['inRoom'] = data.inRoom as boolean;
      }

      this.playerInformationAvailable = true;
    }, err => {
      this.playerInformationAvailable = false;
    });

  }

  public register(nickname: string, volume: number): void {
    var obs = new Observable((observer: Observer<void>) => {
      setTimeout(() => {
        observer.complete();
      }, 5000);
    });

    obs.subscribe({ complete:  () => { console.log('done') }} );
  }

  private readTokensFromCookie(): void {
    if(this.cookiesAvailable()) {
      this.token_access = this.cookieService.get(TOKEN_ACCESS_COOKIE_NAME);
      this.token_refresh = this.cookieService.get(TOKEN_REFRESH_COOKIE_NAME);
      this.tokenInCookie = true;
    }
  }

  private clearCookies() {
    this.cookieService.delete(TOKEN_ACCESS_COOKIE_NAME, TOKEN_PATH);
    this.cookieService.delete(TOKEN_REFRESH_COOKIE_NAME, TOKEN_PATH);
  }

  private cookiesAvailable(): boolean {
    return this.cookieService.check(TOKEN_ACCESS_COOKIE_NAME) && this.cookieService.check(TOKEN_REFRESH_COOKIE_NAME);
  }

  private tokensAvailable(): boolean {
    return this.token_access != undefined && this.token_refresh != undefined;
  }

  private applyRetry(observable: Observable<any>, numberOfRetries: number = 3, delayBetween: number = 1000): Observable<any> {
    return observable.pipe(
      retryWhen((err: any) => {
        let retries = numberOfRetries;

        return err.pipe(
          delay(delayBetween),
          flatMap(err => {
            if (retries-- > 0) {
              return of(err);
            } else {
              throw err;
            }
          })
        );
      })
    );
  }

// old

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
