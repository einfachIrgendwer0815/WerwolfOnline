import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-how-to-play',
  templateUrl: './how-to-play.component.html',
  styleUrls: ['./how-to-play.component.scss']
})
export class HowToPlayComponent implements OnInit {
  arrowBack = faChevronRight;
  backCounter = 0;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  goBack() {
    window.scrollTo({ top: 0, behavior: 'smooth'});
    var interval = setInterval(() => {
      this.backCounter++;
      if(window.pageYOffset <= 10 || this.backCounter > 200) {
        if(this.backCounter > 200) {
          window.scrollTo({ top: 0 });
        }
        this.backCounter = 0;
        this.router.navigate(['../'], {relativeTo: this.route});
        clearInterval(interval);
      }
    }, 10);
  }
}
