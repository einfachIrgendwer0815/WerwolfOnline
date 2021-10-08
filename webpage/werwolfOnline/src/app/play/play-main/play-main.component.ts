import { Component, OnInit } from '@angular/core';
import { LinkService } from '../../services/linkService/link.service';

import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-play-main',
  templateUrl: './play-main.component.html',
  styleUrls: ['./play-main.component.scss']
})
export class PlayMainComponent implements OnInit {

  constructor(private linkService: LinkService, private cookieService: CookieService, private router: Router) {
    this.linkService.setLink("/");
  }

  ngOnInit(): void {
    if (this.cookieService.check('token') == false) {
      this.router.navigate(['/play/settings']);
    }
  }

}
