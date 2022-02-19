import { Component, OnInit } from '@angular/core';
import { LinkService } from '../../services/linkService/link.service';

import { PlayerManagementService } from '../../services/playerManagement/player-management.service';
import { TokenStorageService } from '../../services/tokenStorage/token-storage.service';

import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

import { FormControl, Validators } from '@angular/forms';

import { environment } from '../../../environments/environment';

import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  blockInput: boolean = false;
  isPublic: boolean = false;
  playerLimit = new FormControl(10, [
    Validators.required,
    Validators.min(4)
  ]);
  private pathSub?: Subscription;

  constructor(private player: PlayerManagementService, private token: TokenStorageService, private linkService: LinkService, private cookieService: CookieService, private router: Router) {
    this.linkService.setLink("/play");
  }

  ngOnInit(): void {
    this.pathSub = this.player.getRedirectPath().subscribe(redirPath => {
      if (redirPath != environment.playRoute) {
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

  increment() {
    this.playerLimit.setValue(this.playerLimit.value + 1);
  }

  decrement() {
    var old: number = this.playerLimit.value;
    this.playerLimit.setValue(old - 1);

    if (!this.playerLimit.valid) {
      this.playerLimit.setValue(old);
    }
  }

  async create() {
    if (!this.blockInput) {
      this.blockInput = true;
    } else {
      return;
    }

    this.player.joinRoomObservable('', this.isPublic, this.playerLimit.value)
      .subscribe(async data => {
        if (environment.production == false) {
          console.log(data);
        }
        if (data.successful == false) {
          this.blockInput = false;
        }
      }, err => {
        console.log(err);
        this.blockInput = false;
      });
  }
}
