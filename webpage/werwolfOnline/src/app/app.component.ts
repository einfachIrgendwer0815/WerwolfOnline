import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { trigger, transition } from '@angular/animations';

import { slideRight, slideLeft, overlay, overlayLeftIn, overlayRightIn, overlayRightOut, overlayLeftOut } from './animations';

const routeTransAnim = trigger('routeAnimation', [
  transition('MainPage <=> Play', overlay),
  transition('MainPage => HowToPlay', overlayRightIn),
  transition('HowToPlay => MainPage', overlayLeftOut),
  transition('MainPage => About', overlayLeftIn),
  transition('About => MainPage', overlayRightOut),
  transition('* <=> NotFound', overlay),
  transition('Play <=> Game', overlay),
  transition('Play => HowToPlay', overlay)
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
    //console.log(outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation);
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}
