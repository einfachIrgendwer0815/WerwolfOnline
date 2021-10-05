import { Component, OnInit } from '@angular/core';

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-how-to-play',
  templateUrl: './how-to-play.component.html',
  styleUrls: ['./how-to-play.component.scss']
})
export class HowToPlayComponent implements OnInit {
  arrowBack = faChevronRight;

  constructor() { }

  ngOnInit(): void {
  }

}
