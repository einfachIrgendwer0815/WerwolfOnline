import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { LinkService } from '../services/linkService/link.service';

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import { trigger, transition } from '@angular/animations';

import { animations } from '../animations';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
  animations: [
    trigger('test', [
      transition("PlayMain => PlayJoin", animations.overlayLeftIn),
      transition("PlayMain => PlayCreate", animations.overlayLeftIn),
      transition("PlayJoin => PlayMain", animations.overlayRightOut),
      transition("PlayCreate => PlayMain", animations.overlayRightOut),
      transition("PlaySettings => PlayMain", animations.overlay),
      transition("PlayMain => PlaySettings", animations.overlay)
    ])
  ]
})
export class PlayComponent implements OnInit {
  arrowBack = faChevronLeft;

  constructor(public linkService: LinkService) { }

  ngOnInit(): void {
  }

  prepareRoute(outlet: RouterOutlet) {
    //console.log(outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation);
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

}
