import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { LinkService } from '../services/linkService/link.service';

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import { trigger, transition } from '@angular/animations';

import { slideRight, slideLeft, overlay, overlayLeftIn, overlayRightIn, overlayRightOut, overlayLeftOut } from '../animations';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
  animations: [
    trigger('test', [
      transition("PlayMain => PlayJoin", overlayLeftIn),
      transition("PlayMain => PlayCreate", overlayLeftIn),
      transition("PlayJoin => PlayMain", overlayRightOut),
      transition("PlayCreate => PlayMain", overlayRightOut),
      transition("PlaySettings => PlayMain", overlay),
    ])
  ]
})
export class PlayComponent implements OnInit {
  arrowBack = faChevronLeft;

  constructor(public linkService: LinkService) { }

  ngOnInit(): void {
  }

  prepareRoute(outlet: RouterOutlet) {
    console.log(outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation);
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

}
