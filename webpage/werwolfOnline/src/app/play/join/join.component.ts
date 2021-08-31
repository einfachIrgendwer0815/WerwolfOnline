import { Component, OnInit } from '@angular/core';
import { LinkService } from '../../services/linkService/link.service';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent implements OnInit {

  constructor(private linkService: LinkService) {
    this.linkService.setLink("/play");
  }

  ngOnInit(): void {
  }

}
