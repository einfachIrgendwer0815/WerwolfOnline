import { Component, OnInit } from '@angular/core';
import { LinkService } from '../../services/linkService/link.service';

import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  constructor(private linkService: LinkService, private cookieService: CookieService, private router: Router) {
    this.linkService.setLink("/play");
  }

  ngOnInit(): void {
    if (this.cookieService.check('token') == false) {
      this.router.navigate(['/play/settings']);
    }
  }

}
