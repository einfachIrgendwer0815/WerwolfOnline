import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss', './scss/headlines.scss', './scss/headlines/no1.scss', './scss/buttonBox.scss']
})
export class MainPageComponent implements OnInit {
  public animClasses: string[] = [];

  constructor() { }

  ngOnInit(): void {
    var length: number = parseInt(document.getElementById("mainPage-wordobj")?.getAttribute('count') as string);

    for(let i = 0; i < length; i++) {
      this.animClasses.push(this.genAnimClass());
    }
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
