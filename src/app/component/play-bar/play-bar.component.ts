import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
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
    { songUrl: 'assets/music/云烟成雨.mp3', songName: '云烟成雨', artistName: '房东的猫' },
    { songUrl: 'assets/music/童话镇_发er陈一.mp3', songName: '童话镇', artistName: '陈一发儿' },
    { songUrl: 'assets/music/琵琶行.mp3', songName: '琵琶行', artistName: '徒有琴' },
    { songUrl: 'assets/music/可念不可说.mp3', songName: '可念不可说', artistName: '崔子格' },
  ];
  // currently playing song
  songDetail: any = {};
  // play mode list: 列表循环 单曲循环 随机播放
  playMode: Array<string> = ['list', 'single', 'random'];
  // play mode index
  playModeIndex: number = 0;
  // play history, used to return to the previous track
  private playHistory: Array<any> = [];

  @ViewChild('audioPlayer', { static: true })
  audioPlayer: ElementRef;
  @ViewChild('progressBar', { static: true })
  progressBar: ElementRef;
  /* @ViewChild('progressBar', { static: true, read: ViewContainerRef })
  progressBar: ViewContainerRef;
  // elementInput = this.progressBar.element.nativeElement */

  constructor(
    private renderer: Renderer2,
  ) { }

  ngOnInit() {
    if (!this.songDetail || !this.songDetail.songUrl) {
      this.songDetail = {
        // songUrl: 'file:///home/luoyuecheng/music/云烟成雨.mp3',
        songUrl: 'assets/music/云烟成雨.mp3',
        songName: '风月',
        artistName: '黄龄',
        playing: false
      }
      this.playHistory.push({ ...this.songDetail, playing: true });
      // this.songDetail = this.switchSong(this.playModeIndex);
    }
  }

  // prevPlay, play the previous track, or select a song to play up in the list
  prevPlay() {
    if (this.playHistory && this.songDetail) {
      const historyIndex = this.playHistory.findIndex(song => {
        const isRight = song.playing && song.songUrl === this.songDetail.songUrl;
        song.playing = false;
        return isRight;
      });

      if (historyIndex > 0) {
        this.songDetail = this.playHistory[historyIndex - 1];
        this.togglePlay();
        return true;
      }

      // modeType is 2 - random
      if (this.playModeIndex === 2) {
        const songsLength = this.songList.length;

        if (songsLength === 1) {
          this.songDetail = this.songList[0];
          return true;
        }

        const songFilter = this.songList.filter(song => song.songUrl !== this.songDetail.songUrl);
        const randomIndex = Math.floor(Math.random() * songFilter.length);
        this.songDetail = songFilter[randomIndex];
        return true;
      }

      let songIndex = this.songList.findIndex(song => song.songUrl === this.songDetail.songUrl);
      songIndex = songIndex < 1 ? this.songList.length -1 : songIndex - 1;
      this.songDetail = this.songList[songIndex];
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
    // this.songDetail = this.switchSong(this.playModeIndex);
    // songs list length
    const songsLength = this.songList.length;
    let songIndex: number;
    if (this.songList) {
      songIndex = this.songList.findIndex(song => song.songUrl === this.songDetail.songUrl);
    }

    let switchedSong;

    switch (this.playModeIndex) {
      case 0:
        if (songIndex === -1 || typeof songIndex === 'undefined') {
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

    // play history is empty array -- no history
    if (!this.playHistory.length) {
      this.playHistory.push({ ...switchedSong, playing: true });
      this.songDetail = switchedSong;
      return switchedSong;
    }

    const historyIndex = this.playHistory.findIndex(_ =>
      _.playing && _.songUrl === this.songDetail.songUrl);

    // current song does not exist playHistory
    if (historyIndex === -1) {
      this.playHistory.push({ ...switchedSong, playing: true });
      this.songDetail = switchedSong;
      return switchedSong;
    }

    this.playHistory = this.playHistory.slice(0, historyIndex + 1);
    this.playHistory[historyIndex]['playing'] = false;

    this.songDetail = switchedSong;
    this.playHistory.push({ ...switchedSong, playing: true });

    return switchedSong;
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

  // song playback complete
  playComplete(playModeIndex, songDetail) {
    // this.songDetail = this.switchSong(playModeIndex);
    // reset value of progress bar
    // const inputProgress: HTMLInputElement = this.progressBar.nativeElement;
    // inputProgress.value = '0';

    const inputProgress: HTMLElement = this.progressBar.nativeElement;
    this.renderer.setStyle(inputProgress, 'width', 0);
  }

  // audio message loadedmetadata
  playLoadedmetadata(songDetail) {
    // const audio: HTMLAudioElement = this.audioPlayer.nativeElement;
    // const inputProgress: HTMLInputElement = this.progressBar.nativeElement;
    // inputProgress.max = new String(audio.duration) as string;
    // inputProgress.value = '0';
  }

  // audio timeupdate
  // update currentTime of audio to customized progress bar
  playTimeupdate() {
    const audio: HTMLAudioElement = this.audioPlayer.nativeElement;
    // const inputProgress: HTMLInputElement = this.progressBar.nativeElement;
    // inputProgress.value = new String(audio.currentTime) as string;

    const inputProgress: HTMLElement = this.progressBar.nativeElement;
    const width = Math.floor(audio.currentTime / audio.duration * 10000) / 100;
    this.renderer.setStyle(inputProgress, 'width', width + '%');
  }

  // switch song
  // playModeIndex: 0-list 1-single 2-random
  // operationType: prev, next, complete
  switchSong(operationType: string) {
    if (this[operationType] instanceof Function) {
      this[operationType].call(this);
    }
  }

  // change / input volume
  handleVolume(volume) {
    const audio = this.audioPlayer.nativeElement;
    audio.volume = volume;
  }

  handleProgress(progress) {
    const audio = this.audioPlayer.nativeElement;
    audio.currentTime = progress;
  }

  setProgress(e: MouseEvent) {
    // console.log((e.target as HTMLElement).clientWidth);
    // console.log(e.offsetX);
    const progressBar = this.progressBar.nativeElement.parentElement;
    const progressBarWidth = progressBar.clientWidth;
    const audio = this.audioPlayer.nativeElement;
    const mouseOffsetX = e.offsetX;
    const setAudioTime = Math.floor(mouseOffsetX / progressBarWidth * audio.duration);
    audio.currentTime = setAudioTime;
  }
}
/*
  返回上一曲：
    每播放一首歌曲，将其添加至缓存列表，返回上一曲时，删除最后一首，并将删除后的列表中的最后一首播放，
    若删除列表中最后一首后，列表为空，此时视播放模式选择上一曲。若为随机播放，则从列表中随机选择一首，
    若非随机播放，则从歌曲列表中查找当前播放歌曲位置，并播放列表中的上一首。
*/
