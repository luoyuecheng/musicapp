import { Component, OnInit } from '@angular/core';

import { SongService } from '../component/play-bar/song.service';

let isElectron: boolean = window && window['process'] && (window['process'] as any).type;
let fs: any;
let electron: any;
let remote: any;

if (isElectron) {
  fs = (window['require'] as any)('fs');
  electron = (window['require'] as any)('electron');
  remote = electron.remote;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private songService: SongService,
  ) { }

  ngOnInit() {
    document.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      for (const f of (e.dataTransfer as any).files) {
        console.log('File(s) you dragged here: ', f.path);
      }
    })
  }

  importMusic() {
    if (!remote) return false;
    const dialog = remote.dialog;
    const files = dialog.showOpenDialogSync();
    console.log(files);
    if (typeof files === 'undefined') return false;

    this.songService.addToSongList({ songUrl: `file:///${files[0]}`, songId: new Date().getDate(), songName: 'a' });
    this.songService.pushEventEmit('song');
  }
}
