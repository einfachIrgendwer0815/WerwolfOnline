import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LinkService } from '../../services/linkService/link.service';

import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { generateToken } from '../../../apiInterfaces/token';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  access_token: string | undefined;
  refresh_token: string | undefined;
  authenticated: boolean = false;

  constructor(private linkService: LinkService, private client: HttpClient, private cookieService: CookieService) {
    this.linkService.setLink("/");
  }

  ngOnInit(): void {
  }

  generateTokens() {
    this.client.get<generateToken>(environment.serverName + '/api/token/generate', {observe: 'body', responseType: 'json'})
      .subscribe(
        data => {
          this.access_token = data.access_token;
          this.refresh_token = data.refresh_token;
          this.cookieService.set('token', this.access_token as string);
          this.cookieService.set('token_refresh', this.refresh_token as string);
        }
      );
  }

  loadOrGenerateToken() {
    if (this.cookieService.check('token') == false) {
      this.generateTokens()
    } else {
      this.access_token = this.cookieService.get('token');
      this.refresh_token = this.cookieService.get('token_refresh');
    }
  }

}
