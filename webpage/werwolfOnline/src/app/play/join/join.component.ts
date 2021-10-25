import { Component, OnInit } from '@angular/core';
import { LinkService } from '../../services/linkService/link.service';
import { TokenStorageService } from '../../services/tokenStorage/token-storage.service';

import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent implements OnInit {

  constructor(private tokenStorage: TokenStorageService, private linkService: LinkService, private cookieService: CookieService, private router: Router) {
    this.linkService.setLink("/play");
  }

  async ngOnInit(): Promise<void> {
    await this.tokenStorage.validateTokenFromCookie();

    if (this.tokenStorage.token_valid != true) {
      this.router.navigate(['/play/settings']);
    }
  }

}
