import { Component, OnInit } from '@angular/core';
import { LinkService } from '../../services/linkService/link.service';
import { TokenStorageService } from '../../services/tokenStorage/token-storage.service';

import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-play-main',
  templateUrl: './play-main.component.html',
  styleUrls: ['./play-main.component.scss']
})
export class PlayMainComponent implements OnInit {

  constructor(private tokenStorage: TokenStorageService, private linkService: LinkService, private cookieService: CookieService, private router: Router) {
    this.linkService.setLink("/");
  }

  async ngOnInit(): Promise<void> {
    await this.tokenStorage.validateTokenFromCookie();

    if (this.tokenStorage.token_valid != true) {
      this.router.navigate(['/play/settings']);
    }
  }

}
