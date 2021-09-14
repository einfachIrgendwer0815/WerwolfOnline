import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  letterAnimationClasses: Array<string> = [];
  approxLength: number = 7;

  constructor() { }

  ngOnInit(): void {
    this.genAnimationClasses();
  }

  genRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  genAnimationClasses() {
    for(var i:number = 0; i < this.approxLength; i++) {
      var thisClasses: string = '';

      if (this.genRandomNumber(1, 5) < 4) {
        thisClasses = 'animate';

        thisClasses += ' anim' + this.genRandomNumber(1,3).toString();
        thisClasses += ' delay' + this.genRandomNumber(1,7).toString();
      }

      this.letterAnimationClasses.push(thisClasses);
    }

  }

  getAnimationClass(id: number): string {
    if (id >= this.letterAnimationClasses.length) {
      return '';
    }

    return this.letterAnimationClasses[id];
  }
}
