import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  components: Array<string> = new Array<string>();
  data: {[key: string]: any} = {};

  constructor() { }

  registerComponent(name: string) {
    this.components.push(name);
  }
}
