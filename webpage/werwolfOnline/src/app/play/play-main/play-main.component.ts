import { Component, OnInit } from '@angular/core';
import { LinkService } from '../../services/linkService/link.service';

@Component({
  selector: 'app-play-main',
  templateUrl: './play-main.component.html',
  styleUrls: ['./play-main.component.scss']
})
export class PlayMainComponent implements OnInit {

  constructor(private linkService: LinkService) {
    this.linkService.setLink("/");
  }

  ngOnInit(): void {
  }

}
