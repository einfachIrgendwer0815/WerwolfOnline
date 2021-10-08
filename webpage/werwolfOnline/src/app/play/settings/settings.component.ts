import { Component, OnInit } from '@angular/core';

import { LinkService } from '../../services/linkService/link.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private linkService: LinkService) {
    this.linkService.setLink("/");
  }

  ngOnInit(): void {
  }

}
