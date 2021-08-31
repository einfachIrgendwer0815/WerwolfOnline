import { Component, OnInit } from '@angular/core';
import { LinkService } from '../../services/linkService/link.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  constructor(private linkService: LinkService) {
    this.linkService.setLink("/play");
  }

  ngOnInit(): void {
  }

}
