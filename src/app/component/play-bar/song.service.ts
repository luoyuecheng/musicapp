import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class SongService {
  public songList = [];
  public eventEmit: EventEmitter<any>;

  constructor () {
    this.eventEmit = new EventEmitter();
  }

  addToSongList(songs: object|any[]) {
    if (songs instanceof Array) {
      for (let song of songs) {
        const findIndex = this.songList.findIndex(_ => _.songUrl === song.songUrl);
        if (findIndex !== -1) continue;
        this.songList.push(song);
      }
      return true;
    }
    this.songList.push(songs);
    return true;
  }

  getSongList() {
    return this.songList;
  }

  /**
   * Emits an event containing a given value.
   * @param value the value to emit.
   */
  pushEventEmit(value?: any) {
    this.eventEmit.emit(value);
  }
}
