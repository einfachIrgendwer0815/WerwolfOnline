import { Component, OnInit } from '@angular/core';

import { TokenStorageService } from '../services/tokenStorage/token-storage.service';

import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  constructor(private tokenStorage: TokenStorageService, private cookieService: CookieService, private router: Router) { }

  async ngOnInit(): Promise<void> {
    await this.tokenStorage.validateTokenFromCookie();

    if (this.tokenStorage.token_valid != true) {
      this.router.navigate(['/play/settings']);
    }
  }
}
