import { Injectable } from '@angular/core';
import { Observable, Observer, of, Subject } from 'rxjs';
import { retryWhen, flatMap, delay } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { HttpClient } from '@angular/common/http';

import { TokenStorageService } from '../tokenStorage/token-storage.service';

import { generateToken, identityInformation } from '../../../apiInterfaces/token';
import { fullRegister, registrationInformation } from '../../../apiInterfaces/player';
import { joinRoom, info } from '../../../apiInterfaces/room';

const TOKEN_ACCESS_KEY_NAME: string = "token";
const TOKEN_REFRESH_KEY_NAME: string = "token_refresh";
const DELETE_DATA_ON_ERROR: boolean = false;

@Injectable({
  providedIn: 'root'
})
export class PlayerManagementService {
  private token_access?: string;
  private token_refresh?: string;
  private token_valid: boolean = false;
  private tokenInStorage: boolean = false;
  private playerInformation: { [id: string]: string|number|boolean } = {};
  private playerInformationAvailable: boolean = false;
  private roomInformation?: { [id: string]: string|number|boolean| {identity:string, nickname: string}[] };

  private subjects: { [id: string ]: Subject<any> } = {};

  private intervals: { [id: string]: number } = {};
  private initDone: boolean = false;

  constructor(private client: HttpClient, private tokenStorage: TokenStorageService) {
    this.setAllIntervals();
    this.createSubjects();
  }

  private createSubjects(): void {
    this.subjects.nickname = new Subject<string>();
    this.subjects.path = new Subject<string>();
    this.subjects.roomInfo = new Subject<{ [id: string]: string|number|boolean| {identity:string, nickname: string}[] }>();
  }

  private setAllIntervals(): void {
    this.setFiveSecondInterval();
    this.setFiveHundredMilliSecondInterval();
  }

  private setFiveSecondInterval(): void {
    this.intervals.fiveS = setInterval(() => {
      if(!environment.production) {
        console.log(this);
        console.log(this.playerInformation);
      }

      var resp = this.loadPlayerInformation();

      if(resp !== undefined) {
        resp.subscribe(null, null, () => {
          if(this.playerInformation.inRoom == true) {
            this.loadRoomInformation();
          }
        });
      }
    }, 5000);
  }

  private setFiveHundredMilliSecondInterval(): void {
    this.intervals.fiveHundredMS = setInterval(() => {
      this.sendNickname(this.subjects.nickname);

      this.sendRedirectPath(this.subjects.path);

      this.sendRoomInfo(this.subjects.roomInfo)
    }, 500);
  }

  private sendNickname(subject: Subject<string>): void {
    if(this.playerInformation.nickname != undefined) {
      subject.next(this.playerInformation.nickname as string);
    }
  }

  private sendRoomInfo(subject: Subject<{ [id: string]: string|number|boolean| {identity:string, nickname: string}[] }>): void {
    if(this.roomInformation != undefined && this.playerInformation.inRoom == true) {
      subject.next(this.roomInformation);
    }
  }

  public getNickname(): Subject<string> {
    return this.subjects.nickname;
  }

  public getRoomInfo(): Subject<{ [id: string]: string|number|boolean| {identity:string, nickname: string}[] }> {
    return this.subjects.roomInfo;
  }

  private sendRedirectPath(subject: Subject<string>): void {

  }

  public getRedirectPath(): Observable<string> {
    return new Observable<string>((observer: Observer<string>) => {
      var oldPath: string = '';
      var newPath: string = '';

      var interval: number = setInterval(() => {
        if(this.playerInformation.registered != undefined) {
          if(!this.tokensAvailable() || this.playerInformation.registered == false) {
            newPath = '/play/settings';
          } else {
            if(this.playerInformation.inRoom == undefined || this.playerInformation.inRoom == false){
              newPath = '/play';
            } else {
              newPath = '/game';
            }
          }
        }

        if(newPath != oldPath) {
          oldPath = newPath;
          observer.next(newPath);
        }
      }, 50);
    });
  }

  public initialize() {
    if(this.initDone) return;

    var onSucess = (data: identityInformation) => {
      this.loadPlayerInformation();
    };

    var onErr = (err: any) => {
      this.token_access = undefined;
      this.token_refresh = undefined;
      this.tokenInStorage = false;
      this.playerInformation['registered'] = false;
      this.roomInformation = undefined;
      if(DELETE_DATA_ON_ERROR) this.clearStorage();
    };

    this.readTokensFromStorage();

    if(this.tokensAvailable()) {
      this.validateToken(onSucess, onErr);
    } else {
      onErr(null);
    }

    this.initDone = true;
  }

  private validateToken(onValid?: any, onInvalid?: any): void {
    if (!this.tokensAvailable()) {
      this.token_valid = false;
      onInvalid();
    }

    var url: string = environment.serverName + environment.api.route + environment.api.token.route + environment.api.token.identityInformation.route;
    url += '?jwt=' + this.token_access;
    var resp: Observable<identityInformation> = this.client.get<identityInformation>(url, {observe: 'body', responseType: 'json'});
    resp = this.applyRetry(resp, 2, 5000);

    resp.subscribe(data => {
      this.token_valid = true;
      onValid(data);
    }, err => {
      this.token_valid = false;
      onInvalid(err);
    });
  }

  private loadPlayerInformation(): Observable<registrationInformation> | void {
    if (!this.tokensAvailable() || !this.token_valid) {
      return;
    }

    var url: string = environment.serverName + environment.api.route + environment.api.player.route + environment.api.player.registrationInformation.route;
    url += '?jwt=' + this.token_access;
    var resp: Observable<registrationInformation> = this.client.get<registrationInformation>(url, {observe: 'body', responseType: 'json'});
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
      this.validateToken();
    });

    return resp;
  }

  private loadRoomInformation(): void {
    if (!this.tokensAvailable() || !this.token_valid) {
      return;
    }

    var url: string = environment.serverName + environment.api.route + environment.api.room.route + environment.api.room.info.route;
    url += '?jwt=' + this.token_access;
    var resp: Observable<info> = this.client.get<info>(url, {observe: 'body', responseType: 'json'});
    resp = this.applyRetry(resp, 5, 5000);

    resp.subscribe(data => {
      this.roomInformation = {};
      this.roomInformation["code"] = data["code"];
      this.roomInformation["members"] = data["members"];
      this.roomInformation["public"] = data["public"];
    });
  }

  public register(nickname: string, volume: number): Observable<fullRegister> {
    var execFullRegister = (observer: Observer<fullRegister>) => {
      var req: Observable<fullRegister> = this.sendFullRegister(nickname, volume);
      req = this.applyRetry(req, 5, 5000);

      req.subscribe(data => {
        this.saveTokensToStorage();

        observer.next(data);
        observer.complete();
      }, err => {
        observer.error(err);
      });
    }

    return new Observable<fullRegister>((observer: Observer<fullRegister>) => {
      if(!this.tokensAvailable() && true) {
        this.generateTokens_()
          .subscribe(data => {
            this.setTokens(data.access_token, data.refresh_token);
            this.token_valid = true;

            execFullRegister(observer);
          }, err => {
            observer.error('Could not generate tokens.');
          });
      } else {
        execFullRegister(observer);
      }
    });
  }

  private generateTokens_(): Observable<generateToken> {
    var url: string = environment.serverName + environment.api.route + environment.api.token.route + environment.api.token.generate.route;
    var req =  this.client.get<generateToken>(url, {observe: 'body', responseType: 'json'});
    req = this.applyRetry(req, 3, 5000);

    return req;
  }

  private sendFullRegister(nickname: string, volume: number): Observable<fullRegister> {
    var url: string = environment.serverName + environment.api.route + environment.api.player.route + environment.api.player.fullRegistration.route;
    url = url + "?jwt=" + this.token_access;
    var req = this.client.post<fullRegister>(url, {nickname: nickname, volume: volume}, {headers: {'Content-Type': 'application/json'}, observe: 'body', responseType: 'json'});
    return req;
  }

  public joinRoom(roomCode: string = '', isPublic: boolean = false, playerLimit: number = 10): Observable<joinRoom> {
    var url: string = environment.serverName + environment.api.route + environment.api.room.route + environment.api.room.join.route;
    url = url + "?jwt=" + this.token_access as string;

    var req = this.client.post<joinRoom>(url, {roomName: roomCode, roomIsPublic: isPublic, roomPlayerLimit: playerLimit}, {observe: 'body', responseType: 'json'});
    return req;
  }

  public leaveRoom(): Observable<{ refresh: boolean }> {
    var url: string = environment.serverName + environment.api.route + environment.api.room.route + environment.api.room.leave.route;
    url = url + "?jwt=" + this.token_access as string;

    var req = this.client.get<{ refresh: boolean }>(url, {observe: 'body', responseType: 'json'});
    return req;
  }

  private readTokensFromStorage(): void {
    if(this.storageAvailable()) {
      this.token_access = localStorage.getItem(TOKEN_ACCESS_KEY_NAME) as string;
      this.token_refresh = localStorage.getItem(TOKEN_REFRESH_KEY_NAME) as string;
      this.tokenInStorage = true;
    }
  }

  private setTokens(access: string, refresh: string, saveToStorage: boolean = false): void {
    this.token_access = access;
    this.token_refresh = refresh;

    if(saveToStorage) {
      this.saveTokensToStorage();
    } else {
      this.tokenInStorage = false;
    }
  }

  private saveTokensToStorage(): void {
    if(this.tokensAvailable()) {
      localStorage.setItem(TOKEN_ACCESS_KEY_NAME, this.token_access as string);
      localStorage.setItem(TOKEN_REFRESH_KEY_NAME, this.token_refresh as string);
      this.tokenInStorage = true;
    }
  }
  private clearStorage() {
    localStorage.removeItem(TOKEN_ACCESS_KEY_NAME);
    localStorage.removeItem(TOKEN_REFRESH_KEY_NAME);
  }

  private storageAvailable(): boolean {
    return (localStorage.getItem(TOKEN_ACCESS_KEY_NAME) != null) && (localStorage.getItem(TOKEN_REFRESH_KEY_NAME) != null);
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
}
