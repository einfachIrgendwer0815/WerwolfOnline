import { Injectable } from '@angular/core';
import { Observable, Observer, of } from 'rxjs';
import { retryWhen, flatMap, delay } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { HttpClient } from '@angular/common/http';

import { TokenStorageService } from '../tokenStorage/token-storage.service';

import { generateToken, identityInformation } from '../../../apiInterfaces/token';
import { fullRegister, registrationInformation } from '../../../apiInterfaces/player';
import { joinRoom } from '../../../apiInterfaces/room';

const TOKEN_ACCESS_KEY_NAME: string = "token";
const TOKEN_REFRESH_KEY_NAME: string = "token_refresh";
const DELETE_DATA_ON_ERROR: boolean = false;

@Injectable({
  providedIn: 'root'
})
export class PlayerManagementService {
  private token_access?: string;
  private token_refresh?: string;
  private tokenInStorage: boolean = false;
  private skipValidation: boolean = false;
  private playerInformation: { [id: string]: string|number|boolean } = {};
  private playerInformationAvailable: boolean = false;
  private roomInformation?: { [id: string]: string|number|boolean };

  constructor(private client: HttpClient, private tokenStorage: TokenStorageService) {
    this.initialize();
    if(environment.production == false) {
      console.log(this);

      setInterval(() => {
        console.log(this);
        console.log(this.playerInformation);
      }, 5000);

    }

    setInterval(() => {
      this.initialize();
    }, 10000)
  }

  public getNickname(): Observable<string> {
    return new Observable<string>((observer: Observer<string>) => {
      var returnIfAvailable = (interval?: number) => {
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

  private initialize() {
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

    if(this.tokensAvailable() && !this.skipValidation) {
      this.validateToken(onSucess, onErr);
    } else {
      onErr(null);
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
    });
  }

  private loadPlayerInformation(): void {
    if (!this.tokensAvailable()) {
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
      this.playerInformationAvailable = false;
    });

  }

  public register(nickname: string, volume: number): Observable<fullRegister> {
    var execFullRegister = (observer: Observer<fullRegister>) => {
      var req: Observable<fullRegister> = this.sendFullRegister(nickname, volume);
      req = this.applyRetry(req, 5, 5000);

      req.subscribe(data => {
        this.saveTokensToStorage();
        this.skipValidation = false;

        observer.next(data);
        observer.complete();
      }, err => {
        observer.error(err);
        this.skipValidation = false;
      });
    }

    return new Observable<fullRegister>((observer: Observer<fullRegister>) => {
      if(!this.tokensAvailable() && true) {
        this.generateTokens_()
          .subscribe(data => {
            this.skipValidation = true;
            this.setTokens(data.access_token, data.refresh_token);
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

// old
  joinRoom(roomCode: string = '', isPublic: boolean = false, playerLimit: number = 10): Promise<joinRoom> {
    return this.joinRoomObservable(roomCode, isPublic, playerLimit).toPromise();
  }

  joinRoomObservable(roomCode: string = '', isPublic: boolean = false, playerLimit: number = 10): Observable<joinRoom> {
    var url: string = environment.serverName + environment.api.route + environment.api.room.route + environment.api.room.join.route;
    if (environment.api.player.fullRegistration.requiresJWT == true) {
      url = url + "?jwt=" + this.token_access as string;
    }
    var req = this.client.post<joinRoom>(url, {roomName: roomCode, roomIsPublic: isPublic, roomPlayerLimit: playerLimit}, {observe: 'body', responseType: 'json'});
    return req;
  }
}
