import { Component, OnInit } from '@angular/core';

import { PlayerManagementService } from '../services/playerManagement/player-management.service';

import { Subscription } from 'rxjs';

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

  private nicknameSubscription: Subscription;

  constructor(private player: PlayerManagementService) {
    this.nicknameSubscription = this.player.getNickname().subscribe(name => {
      this.name = name;
    });
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.nicknameSubscription?.unsubscribe();
  }

  isPopupOpen(): string {
    if (this.popupOpen) {
      return 'open';
    }

    return '';
  }
}
