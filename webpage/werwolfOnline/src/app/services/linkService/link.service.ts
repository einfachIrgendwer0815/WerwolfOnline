import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LinkService {
  link: string = "/";

  constructor() { }

  setLink(value: string) {
    this.link = value;
    console.log(value);
  }
}
