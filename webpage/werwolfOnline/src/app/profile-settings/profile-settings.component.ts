import { Component, OnInit } from '@angular/core';

import { PlayerManagementService } from '../services/playerManagement/player-management.service';

import { faSortDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent implements OnInit {
  downArrow = faSortDown;
  name?: string;
  popupOpen: boolean = false;

  constructor(private player: PlayerManagementService) {
    this.player.getNickname().subscribe((data) => {
      this.name = data;
    })
  }

  ngOnInit(): void { }

  isPopupOpen(): string {
    if (this.popupOpen) {
      return 'open';
    }

    return '';
  }
}
