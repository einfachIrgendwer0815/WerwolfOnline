import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { trigger, transition } from '@angular/animations';

import { slideRight, slideLeft, overlay, overlayLeft, overlayRight } from './animations';

const routeTransAnim = trigger('routeAnimation', [
  transition('MainPage <=> Play', overlay),
  transition('MainPage => HowToPlay', overlayRight),
  transition('HowToPlay => MainPage', overlayLeft),
  transition('MainPage => About', overlayLeft),
  transition('About => MainPage', overlayRight),
  transition('* <=> NotFound', overlay),
  transition('Play <=> Game', overlay)
])

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    routeTransAnim
  ]
})
export class AppComponent {
  title = 'werwolfOnline';

  prepareRoute(outlet: RouterOutlet) {
    console.log(outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation);
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}
