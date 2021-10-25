import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

  genRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  parseInt(text: string | null) {
      return parseInt(text as string);
  }

  genAnimClass(): string {
    var thisClasses: string = '';

    if (this.genRandomNumber(1, 5) < 3) {
      thisClasses = 'animate';

      thisClasses += ' anim' + this.genRandomNumber(1,3).toString();
      thisClasses += ' delay' + this.genRandomNumber(1,7).toString();
    }

    return thisClasses;
  }
}
