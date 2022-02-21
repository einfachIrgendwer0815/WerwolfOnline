import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

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
  styleUrls: ['./settings.component.scss', './scss/unauthenticatedBlock.scss', './scss/errorPopup.scss']
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
  private pathSub?: Subscription;

  constructor(
    private player: PlayerManagementService,
    private tokenStorage: TokenStorageService,
    private linkService: LinkService,
    private cookieService: CookieService,
    private router: Router
  ) {
    this.linkService.setLink("/");
  }

  ngOnInit(): void {
    this.pathSub = this.player.getRedirectPath().subscribe(redirPath => {
      if (redirPath != environment.playerSettingsRoute) {
        this.router.navigate([redirPath]);

        if (environment.production == false) {
          console.log("Redirecting");
          this.pathSub?.unsubscribe();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.pathSub?.unsubscribe();
  }

  async save(): Promise<void> {
    if (!this.nickname.valid) {
      this.openPopup();
      return;
    }
    this.authenticated = true;

    this.player.register(this.nickname.value, this.volume.value)
      .subscribe(null,
        () => {
          this.openPopup();
          this.authenticated = false;
        }
      );
  }

  openPopup() {
    this.popupOpen = true;
  }

  closePopup() {
    this.popupOpen = false;
  }
}
