import { Component, OnInit } from '@angular/core';

import { SongService } from '../component/play-bar/song.service';

import { isElectron, dialog, fs } from '../utils/electron';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnInit {
  public songList: any[];
  private testSong: Object = {
    songName: '童话镇_发er陈一',
    songUrl: '/assets/music/童话镇_发er陈一.mp3',
  };

  constructor(
    private songService: SongService,
  ) { }

  ngOnInit() {
    this.songService.eventEmit.subscribe((value?: any) => {
      if (value === 'song') {
        this.asnycSongList();
      }
    })
  }

  asnycSongList() {
    this.songList = this.songService.getSongList();
    console.log(this.songList)
  }

  importFolder() {
    // non-environment, no correspongding api.
    if (!isElectron) return false;
    const folders = dialog.showOpenDialogSync({
      title: 'open folder',
      defaultPath: 'C:/Users/xuejianhuang/Music',
      buttonLabel: 'import',
      properties: ['openDirectory']
    })

    // click cancel.
    if (typeof folders === 'undefined') return false;
    console.log(folders);
    for (let folder of folders) {
      console.log(folder);
      try {
        const files = fs.readdirSync(folder, { withFileTypes: true });
        console.log(files);
        const songList = [];
        for (let file of files) {
          const reg = /\.(mp3|wav|ogg)$/ig;
          if (!file.name.match(reg)) continue;
          songList.push({
            songUrl: `file:///${folder}/${file.name}`,
            songName: file.name
          })
        }
        this.songService.addToSongList(songList);
        this.songService.pushEventEmit('song');
      } catch (e) {
        console.log(e);
      }
    }
  }

}
