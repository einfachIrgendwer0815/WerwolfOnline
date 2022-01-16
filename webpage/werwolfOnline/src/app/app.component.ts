import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { trigger, transition } from '@angular/animations';

import { animations } from './animations';

const routeTransAnim = trigger('routeAnimation', [
  transition('MainPage <=> Play', animations.overlay),
  transition('MainPage => HowToPlay', animations.overlayRightInWithOpacity),
  transition('HowToPlay => MainPage', animations.overlayLeftOutWithOpacity),
  transition('MainPage => About', animations.overlayLeftInWithOpacity),
  transition('About => MainPage', animations.overlayRightOutWihtOpacity),
  transition('* <=> NotFound', animations.overlay),
  transition('Play <=> Game', animations.overlay),
  transition('Play => HowToPlay', animations.overlay),
  transition('* <=> Imprint', animations.overlay)
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
