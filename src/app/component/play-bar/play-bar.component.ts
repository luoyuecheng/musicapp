import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EventEmitter } from 'events';

@Component({
  selector: 'app-play-bar',
  templateUrl: './play-bar.component.html',
  styleUrls: ['./play-bar.component.scss']
})
export class PlayBarComponent implements OnInit {
  // song list
  songList: Array<any> = [
    { songUrl: 'assets/music/有美人兮.mp3', songName: '有美人兮', artistName: '赵方婧 / 王梓钰' },
    { songUrl: 'assets/music/云烟成雨.mp3', songName: '云烟成雨', artistName: '房东的猫' }
  ];
  // currently playing song
  songDetail: any = {};
  // play mode list: 列表循环 单曲循环 随机播放
  playMode: Array<string> = ['list', 'single', 'random'];
  // play mode index
  playModeIndex: number = 0;

  @ViewChild('audioPlayer', { static: true })
  audioPlayer: ElementRef;

  constructor() { }

  ngOnInit() {
    if (!this.songDetail || !this.songDetail.songUrl) {
      // this.songDetail = {
      //   // songUrl: 'file:///home/luoyuecheng/music/云烟成雨.mp3',
      //   songUrl: 'assets/music/云烟成雨.mp3',
      //   songName: '风月',
      //   artistName: '黄龄',
      //   playing: false
      // }
      this.songDetail = this.switchSong(this.playModeIndex);
    }
  }

  // switch play or pause
  togglePlay() {
    const audio = this.audioPlayer.nativeElement;
    if (!audio.paused) {
      audio.pause();
      this.songDetail.playing = false;
      return null;
    }
    const playPromise = audio.play();
    if (playPromise) {
      playPromise.then(_ => {
        this.songDetail.playing = true;
      }).catch(error => { console.log(error) });
    }
  }

  // nextPlay select next song
  nextPlay() {
    this.songDetail = this.switchSong(this.playModeIndex);
  }

  // switch play mode
  switchMode(playModeIndex: number) {
    const playModeLength = this.playMode.length;
    if (playModeIndex < playModeLength - 1) {
      this.playModeIndex = playModeIndex + 1;
      return true;
    }
    this.playModeIndex = 0;
    return true;
  }

  // song playback completes
  playCompletes(playModeIndex, songDetail) {
    console.log(songDetail);
    // 0-list 1-single 2-random
    const songsLength = this.songList.length;
  }

  // switch song
  // playModeIndex: 0-list 1-single 2-random
  switchSong(playModeIndex: number = 0) {
    // songs list length
    const songsLength = this.songList.length;
    let songIndex: number;
    if (this.songList) {
      songIndex = this.songList.findIndex(song => song.songUrl === this.songDetail.songUrl);
    }

    let switchedSong;

    switch (playModeIndex) {
      case 0:
        if (songIndex === -1) {
          songIndex = 0;
        } else if (songIndex < songsLength - 1) {
          songIndex += 1;
        } else {
          songIndex = 0;
        }
        switchedSong = this.songList[songIndex];
        break;
      default:
        if (songIndex < songsLength - 1) {
          songIndex -= 1;
        } else {
          songIndex = 0;
        }
        switchedSong = this.songList[songIndex];
        break;
    }

    return switchedSong;
  }
}
