import { Component, OnInit } from '@angular/core';

let isElectron: boolean = window && window['process'] && (window['process'] as any).type;
let fs: any;

if (isElectron) {
  fs = (window['require'] as any)('fs');
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    document.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      for (const f of (e.dataTransfer as any).files) {
        console.log('File(s) you dragged here: ', f.path);
      }
    })
  }

}
