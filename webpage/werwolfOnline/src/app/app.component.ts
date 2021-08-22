import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { trigger, transition, style, query, animateChild, group, animate } from '@angular/animations';

import { moveRight, moveLeft } from './animations';

export const slideInAnimation =
  trigger('routeAnimations', [
    transition('MainPage => HowToPlay', moveLeft),
    transition('HowToPlay => MainPage', moveRight),
  ]);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    slideInAnimation
  ]
})
export class AppComponent {
  title = 'werwolfOnline';

  prepareRoute(outlet: RouterOutlet) {
    console.log(outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation);
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}
