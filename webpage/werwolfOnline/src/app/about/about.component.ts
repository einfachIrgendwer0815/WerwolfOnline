import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  icon = faChevronLeft;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
