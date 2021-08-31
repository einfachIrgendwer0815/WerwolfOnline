import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import { trigger, transition } from '@angular/animations';

import { slideRight, slideLeft, overlay, overlayLeft, overlayRight } from '../animations';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
  animations: [
    trigger('test', [
      transition("PlayMain => PlayJoin", overlayLeft),
      transition("PlayMain => PlayCreate", overlayLeft),
      transition("PlayJoin => PlayMain", overlayRight),
      transition("PlayCreate => PlayMain", overlayRight),
    ])
  ]
})
export class PlayComponent implements OnInit {
  arrowBack = faChevronLeft;

  constructor() { }

  ngOnInit(): void {
  }

  prepareRoute(outlet: RouterOutlet) {
    console.log(outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation);
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

}
