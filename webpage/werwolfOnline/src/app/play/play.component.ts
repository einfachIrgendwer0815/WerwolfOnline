import { Component, OnInit } from '@angular/core';

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {
  arrowBack = faChevronLeft;

  constructor() { }

  ngOnInit(): void {
  }

}
