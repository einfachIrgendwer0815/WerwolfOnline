import { Component, OnInit } from '@angular/core';

import { faSortDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent implements OnInit {
  downArrow = faSortDown;
  name?: string;

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.name = "NAME";
    }, 50);
  }

}
